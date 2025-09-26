import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create regular client to verify current user is admin
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authorization')
    }

    // Check if current user is admin
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || !userRole || !['admin', 'super_admin'].includes(userRole.role)) {
      throw new Error('Insufficient permissions')
    }

    const { userId, firstName, lastName, role } = await req.json()

    if (!userId || !firstName || !lastName || !role) {
      throw new Error('Missing required fields')
    }

    // Prevent self-role modification to avoid lockout
    if (userId === user.id && role !== userRole.role) {
      throw new Error('Cannot modify your own role')
    }

    // Security check: Only super admins can modify admin users
    const { data: targetRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (targetRole?.role === 'admin' && userRole.role !== 'super_admin') {
      throw new Error('Only super admins can modify admin users')
    }

    // Update profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`.trim()
      })
      .eq('id', userId)

    if (profileError) {
      throw profileError
    }

    // Update role using upsert
    const { error: roleUpdateError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role
      }, {
        onConflict: 'user_id,role'
      })

    if (roleUpdateError) {
      throw roleUpdateError
    }

    // Log security event
    await supabaseAdmin.from('security_audit_log').insert({
      event_type: 'admin_user_edited',
      user_id: user.id,
      user_email: user.email,
      event_details: {
        edited_user_id: userId,
        updated_fields: {
          first_name: firstName,
          last_name: lastName,
          role: role
        },
        admin_user_id: user.id,
        admin_email: user.email
      }
    })

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'User updated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error editing user:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
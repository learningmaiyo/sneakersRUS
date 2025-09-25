-- Update Brian Maiyo to be an admin (you can change this to any existing user)
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = 'c59c0926-34ca-4942-ae88-e4a50a153149';

-- Or if you want to create a completely new admin user, first create the auth user in Supabase dashboard, 
-- then run this query with the new user's ID:
-- INSERT INTO user_roles (user_id, role) VALUES ('new-user-id-here', 'admin');
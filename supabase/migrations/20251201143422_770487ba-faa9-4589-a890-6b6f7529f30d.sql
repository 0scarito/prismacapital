-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Manually create missing profiles for existing users
INSERT INTO public.profiles (id, display_name, is_partner_user)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', u.email) as display_name,
  CASE WHEN ur.role = 'wealth_manager' THEN true ELSE false END as is_partner_user
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
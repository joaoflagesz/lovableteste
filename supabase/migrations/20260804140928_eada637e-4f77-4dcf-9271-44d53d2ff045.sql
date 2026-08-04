REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.parts_auto_production() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_order_changes() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
-- Function to handle invitation acceptance atomically
create or replace function accept_invitation(
  p_organization_id uuid,
  p_user_id uuid,
  p_user_email text
) returns jsonb as $$
declare
  v_invitation_id uuid;
  v_result jsonb;
begin
  -- Start transaction
  begin
    -- Verify the invitation exists
    select id into v_invitation_id
    from invitations
    where organization_id = p_organization_id
    and lower(email) = lower(p_user_email)
    limit 1;
    
    if v_invitation_id is null then
      v_result := jsonb_build_object(
        'success', false,
        'error', 'Invitation not found or already accepted'
      );
      return v_result;
    end if;
    
    -- Create organization member record
    insert into organization_members (
      user_id,
      organization_id,
      joined_at
    ) values (
      p_user_id,
      p_organization_id,
      current_timestamp
    );
    
    -- Delete the invitation
    delete from invitations
    where id = v_invitation_id;
    
    -- Return success
    v_result := jsonb_build_object('success', true, 'error', null);
    return v_result;
  exception when others then
    -- Handle any errors
    v_result := jsonb_build_object(
      'success', false,
      'error', sqlerrm
    );
    return v_result;
  end;
end;
$$ language plpgsql security definer;

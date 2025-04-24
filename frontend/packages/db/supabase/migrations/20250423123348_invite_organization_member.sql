-- Function to handle organization member invitations atomically
create or replace function invite_organization_member(
  p_email text,
  p_organization_id uuid,
  p_invite_by_user_id uuid
) returns jsonb as $$
declare
  v_is_member boolean;
  v_existing_invite_id uuid;
  v_result jsonb;
begin
  -- Start transaction
  begin
    -- Check if user is already a member
    select exists(
      select 1
      from organization_members om
      join users u on om.user_id = u.id
      where om.organization_id = p_organization_id
      and lower(u.email) = lower(p_email)
    ) into v_is_member;
    
    if v_is_member then
      v_result := jsonb_build_object(
        'success', false,
        'error', 'this user is already a member of the organization'
      );
      return v_result;
    end if;
    
    -- Check if invitation already exists
    select id into v_existing_invite_id
    from invitations
    where organization_id = p_organization_id
    and lower(email) = lower(p_email)
    limit 1;
    
    -- If invitation exists, update it
    if v_existing_invite_id is not null then
      update invitations
      set invited_at = current_timestamp
      where id = v_existing_invite_id;
      
      v_result := jsonb_build_object('success', true, 'error', null);
    else
      -- Create new invitation
      insert into invitations (
        organization_id,
        email,
        invite_by_user_id,
        invited_at
      ) values (
        p_organization_id,
        lower(p_email),
        p_invite_by_user_id,
        current_timestamp
      );
      
      v_result := jsonb_build_object('success', true, 'error', null);
    end if;
    
    -- Commit transaction
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

# Auth0 Dashboard Configuration Required

## 1. Create Post-Login Action

Navigate to **Auth0 Dashboard → Actions → Library → Create Action**

- **Name**: Add Role and Subscription Claims
- **Trigger**: Login / Post Login
- **Runtime**: Node 18 (Recommended)

### Action Code:
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://procuresci.com/';

  // Add role from app_metadata
  if (event.user.app_metadata && event.user.app_metadata.role) {
    api.idToken.setCustomClaim(`${namespace}role`, event.user.app_metadata.role);
  }

  // Add subscription from app_metadata
  if (event.user.app_metadata && event.user.app_metadata.subscription) {
    api.idToken.setCustomClaim(`${namespace}subscription`, event.user.app_metadata.subscription);
  }
};
```

### Deploy the Action:
1. Click **Deploy**
2. Navigate to **Actions → Flows → Login**
3. Drag your "Add Role and Subscription Claims" action to the flow
4. Click **Apply**

## 2. Add User Metadata

Navigate to **Auth0 Dashboard → User Management → Users**

For each user, click on the user and go to **App Metadata** tab, then add:

```json
{
  "role": "tier-1",
  "subscription": "tier-1"
}
```

### Valid Role Values:
- `free`
- `tier-1`
- `tier-2`
- `tier-3`
- `tier-4`
- `admin`

### Valid Subscription Values:
- `free`
- `tier-1`
- `tier-2`
- `tier-3`
- `tier-4`

## 3. Test Configuration

1. Log out of your application
2. Log back in
3. Check browser console or server logs - you should now see:
   - `session.user.role` with the actual value (not null)
   - `session.user.subscription` with the actual value (not null)

## Important Notes

- The namespace `https://procuresci.com/` must match exactly between:
  - The Auth0 Action code
  - The `beforeSessionSaved` hook in `/src/lib/auth0.ts`

- App metadata is system-controlled and cannot be modified by users
- Changes to user metadata require users to log out and log back in to take effect
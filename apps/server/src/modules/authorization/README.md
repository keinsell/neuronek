# Authorization Context

This context handle authorizations based on PGP challenges. It would include operations like creating a challenge, verifying a challenge, granting permissions based on the challenge result, etc.

> In this specific scenario where authorization is based on PGP challenges, it may make sense to separate
> authorization into its own bounded context. This is because the process of verifying a PGP challenge could be complex and involve its own set of domain logic, separate from the simpler process of verifying a user's identity.

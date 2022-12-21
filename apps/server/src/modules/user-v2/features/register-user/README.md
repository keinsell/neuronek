# Create User (`register-user`)

Created By: @keinsell
Last Updated by: @keinsell
Date Created: 20 Dec 2022
Last Revision Date: 20 Dec 2022

## Description

User gets an automatically generated anonymous profile.

## Actors

User.

## Preconditions

None.

## Postconditions

1. User gets an unique `username` which he can change in future.
2. User gets an unique `recoveryKey` which will will allow him to login into application.

## Flow

1. User performs request to create new user
2. System generates `username` and `recoveryKey`
3. `recoveryKey` is going to be securely stored in database (hashed with `argon2`).
4. User recives response of newly created profile which can be now used in application.

## Alternative Flows

None.

## Exeptions

None.

## Requiurements

None.

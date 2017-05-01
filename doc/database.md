## Realtime Database Schema
```
/accounts
    /<USER-ID>
        githubToken = {string}
        email = {string}
        updatedAt = {server timestamp}
        /slots
            /<SLOT-ID>
                name = {string}
                location = {string}
                startAt = {int: epoch seconds}
                endAt = {int: epoch seconds}
                /topic
                    id = {string}
                    name = {string}
/profiles
    /<USER-ID>
        uid = {string}
        name = {string}
        handle = {string}
        photo = {null|string}
/requests
    /<SLOT-ID>
        <USER-ID> = true
/slots
    /<SLOT-ID>
        name = {string}
        location = {string}
        state = {string: open|closed}
        startAt = {int: epoch seconds}
        endAt = {int: epoch seconds}
/topics
    /<SLOT-ID>
        /<TOPIC-ID>
            name = {string}
            /members
                <USER-ID> = true
```
* `/account` - private information for each user, including their GitHub OAuth token and the lunch slots they have signed up for. `/topic` will only be present in a slot once a topic has been assigned by the matching algorithm.
* `/profile` - public information for each user.
* `/requests` - lists of users who have signed up for lunch slots, to be used by the matching algorithm.
* `/slots` - all lunch slots (past, present, and future). Clients should primarily query this by `timestamp`.
* `/topics` - assignments made by the matching algorithm.
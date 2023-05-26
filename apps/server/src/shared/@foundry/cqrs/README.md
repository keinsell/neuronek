# Segregation of Responsibility for Command Queries (CQRS)

- **Command**: A message that represents an intention to perform a write operation on the system.
- **Command Handler**: A component that receives a command message and performs the corresponding write operation on the
  system.
- **Command Bus**: A message queue that receives command messages and routes them to the appropriate command handler.

- **Query**: A message that represents an intention to perform a read operation on the system.
- **Query Handler**: A component that receives a query message and returns the corresponding data from the read model.
- **Query Bus**: A message queue that receives query messages and routes them to the appropriate query handler.

- **Write Model**: A model that is optimized for writing data and is used to store data in the system.
- **Read Model**: A model that is optimized for reading data and is used to provide data to the application’s user
  interface.

- **Event**: A message that represents a fact that has occurred within the system.
- **Event Handler**: A component that receives an event message and performs some action in response (e.g., updating a
  read model).
- **Event Bus**: A message queue that receives event messages and routes them to the appropriate event handler.

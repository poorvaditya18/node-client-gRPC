const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Synchronously we have to load the proto inside server

// once you create the package definition you need to create the packageObject
const packageDefinition = protoLoader.loadSync("./todo.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// package object we need to create
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

var todoService = protoDescriptor.TodoService;

const client = new todoService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.ListTodos({}, (err, todos) => {
  if (!err) {
    console.log(todos);
    client.CreateTodo(
      { id: 3, title: "third Todo", content: "yooo" },
      (err, todo) => {
        if (!err) {
          console.log("Created a new todo");
          client.ListTodos({}, (err, todos) => {
            console.log("after insertion", todos);
          });
        } else {
          console.log(err);
        }
      }
    );
  }
});
// console.log(client);

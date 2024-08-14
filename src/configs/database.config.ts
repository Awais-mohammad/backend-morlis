import { connect, ConnectOptions } from "mongoose";

export const dbConnect = () => {
    connect("mongodb+srv://awais:DoX6GHg8HQS19VUC@cluster0.88al0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
        () => {
            console.log("Database connected successfully");
        },
        (error) => {
            console.error("Database connection failed");
            console.error(error);
        }
    )
}
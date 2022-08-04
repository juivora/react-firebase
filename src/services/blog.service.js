// import { db } from "../firebase";

// const database = db.ref("/blogs");
// class BlogDataService {
//     getAll() {
//         return database;
//     }
//     create(tutorial) {
//         return database.push(tutorial);
//     }
//     update(key, value) {
//         return database.child(key).update(value);
//     }
//     delete(key) {
//         return database.child(key).remove();
//     }
//     deleteAll() {
//         return database.remove();
//     }
// }
// export default new BlogDataService();
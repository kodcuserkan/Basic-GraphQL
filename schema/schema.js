const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
} = graphql;

// const booklist = [
//   { id: "1", name: "Aşk", author: "Elif Şafak", authorId: "1" },
//   {
//     id: "2",
//     name: "Roma İmparatorluğu’nun Gerileyiş ve Çöküş Tarihi",
//     author: "Asım Baltacıgil",
//     authorId: "2",
//   },
//   { id: "3", name: "Devlet Ana", author: "Kemal Tahir", authorId: "3" },
//   {
//     id: "4",
//     name: "Evvel Zaman İçinde",
//     author: "Eflatun Cem Güney",
//     authorId: "4",
//   },
//   { id: "5", name: "Lorem ipsum dolor sit.", author: "Elif Şafak", authorId: "1" },
//   {
//     id: "6",
//     name: "dasd dolor sit.",
//     author: "Asım Baltacıgil",
//     authorId: "2",
//   },
//   { id: "7", name: "Devlet Ana", author: "Kemal Tahir", authorId: "3" },
//   {
//     id: "8",
//     name: "Solar consectetur ipsum dolor sit amet consectetur.",
//     author: "Eflatun Cem Güney",
//     authorId: "4",
//   },
// ];

// const authorslist = [
//   { id: "1", age: 48, author: "Elif Şafak" },
//   {
//     id: "2",
//     age: 44,
//     author: "Asım Baltacıgil",
//   },
//   { id: "3", age: 63, author: "Kemal Tahir" },
//   { id: "4", age: 53, author: "Eflatun Cem Güney" },
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    author: { type: GraphQLString },
    genre: { type: GraphQLString },
    authorId: { type: GraphQLString },
    authorsprofile: {
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authorslist,  {id: parent.authorId});
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    age: { type: GraphQLInt },
    author: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(booklist, {authorId: parent.id})
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // Databaseden verileri çekmek için kullanılacak function
        // console.log(typeof args.id); // GraphQLID number veya string ise her ikisinde de string gelmesini de sağlıyor
        // return _.find(booklist, { id: args.id });
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authorslist, { id: args.id });
        return Author.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return booklist
        return Book.find({});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authorslist
        return Author.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        author: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let author = new Author({
          author: args.author,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        author: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLString },
      },
      resolve(parents, args){
        // console.log(args);
        let book = new Book({
          name: args.name,
          genre: args.genre,
          author: args.author,
          authorId: args.authorId
        });
        return book.save();
      }
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

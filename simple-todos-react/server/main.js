import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { TasksCollection } from '../imports/api/TasksCollection';
import "../imports/api/TaskPublications"; 
import "../imports/api/tasksMethods"; 
import "../server/methods";



async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

const insertTask = (taskText) =>
  TasksCollection.insertAsync({ text: taskText });

Meteor.startup(async () => {

  if ((await TasksCollection.find().countAsync()) === 0) {
    [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ].forEach(insertTask);
  }




  // If the Links collection is empty, add some data.
  // if (await LinksCollection.find().countAsync() === 0) {
  //   await insertLink({
  //     title: 'Do the Tutorial',
  //     url: 'https://www.meteor.com/tutorials/react/creating-an-app',
  //   });

  //   await insertLink({
  //     title: 'Follow the Guide',
  //     url: 'https://guide.meteor.com',
  //   });

  //   await insertLink({
  //     title: 'Read the Docs',
  //     url: 'https://docs.meteor.com',
  //   });

  //   await insertLink({
  //     title: 'Discussions',
  //     url: 'https://forums.meteor.com',
  //   });
  // }

  // // We publish the entire Links collection to all clients.
  // // In order to be fetched in real-time to the clients
  // Meteor.publish("links", function () {
  //   return LinksCollection.find();
  // });



});

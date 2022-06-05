const uuid = require("uuid");
const Person = require("./Person");

class PersonManager {
  constructor() {}

  createPerson(nickname, avatar) {
    const personId = uuid.v4();

    const person = new Person(personId, nickname, avatar);

    return person;
  }
}

module.exports = PersonManager;

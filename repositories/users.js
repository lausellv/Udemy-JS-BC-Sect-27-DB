const fs = require('fs');
const { report } = require('process');
const { stringify } = require('querystring');
const { randomBytes } = require('crypto');

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('creating a repository requires a filename');
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename); // no callback no async code inside a constructor
    } catch (err) {
      fs.writeFileSync(this.filename, '[]'); // no callback here no async code inside a constructor
    }
  }

  async getAll() {
    // open the file
    return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
    // read the contents
    // returned parsed data
  }

  async create(attrs) {
    attrs.id = this.randomId();
    // {email: 2email@asd.com", password: "sdfsdf"}
    const records = await this.getAll(); // retrieves current list of users
    records.push(attrs); // push in new user
    // write updated records to this.filename (users.json)
    // await fs.promises.writeFile(this.filename, JSON.stringify(records), { encoding: 'utf8' });

    await this.writeAll(records);
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2), {
      encoding: 'utf8'
    });
  }

  randomId() {
    return randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }
}

// test helper function
// why do we create a separate function to test out our code
// right now node.js requires us to put asyn await code inside of a function that uses async
//IOW we cannot have a variable that uses await on its own (wld result in an error)
const test = async () => {
  const repo = new UsersRepository('users.json');
  // await repo.create({ email: 'test@test.com', password: 'password1' });
  // await repo.create({ email: 'vlausell@gmail.com', password: 'password2' });
  // const users = await repo.getAll();
  const user = await repo.getOne("f7901d6")
  console.log(user);
};

test();

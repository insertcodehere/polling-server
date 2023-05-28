import { Database } from "sqlite3";

type User = any;

function get(db: Database, userId: string): Promise<User> {
  return new Promise(resolve => {
    db.get(`SELECT id, username, name FROM user WHERE id = ${+userId};`, (err: any, row: any) => {
      if (err) {
        console.log('users.get', err, row);
      }
      resolve({
        ...row,
        id: row.id.toString()
      });
    });
  });
}

function create(db: Database, user: User): Promise<User | null> {
  return new Promise(resolve => {
    db.get(`SELECT * FROM user WHERE username = '${user.username}';`, function (err: any, existingUser: any) {
      if (existingUser) {
        resolve(null);
        return;
      }

      const statement = db.prepare('INSERT INTO user (username, name, password) VALUES (?, ?, ?)');
      statement.run(user.username, user.name, user.password, function (this: any, error: any) {
        db.get(`SELECT * FROM user WHERE id = '${this.lastID}';`, function (err: any, result: any) {
          resolve(result);
        });

        statement.finalize();
      });
    });

  });
}

function login(db: Database, username: string, password: string): Promise<User | null> {
  return new Promise(resolve => {
    db.get(`SELECT id, username, name FROM user WHERE username = '${username}' AND password = '${password}';`, (err: any, row: any) => {
      if (err) {
        resolve(null);
        return;
      }

      resolve({
        ...row,
        id: row.id.toString()
      });
    });
  });
}

export const users = {
  get,
  create,
  login
};

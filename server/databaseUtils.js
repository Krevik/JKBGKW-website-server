const BINDS_DATABASE_REF = "binds";

const addBind = async (db, bindToAdd) => {
	return new Promise(function (resolve, reject) {
		if (!bindToAdd) {
			return reject("No bind was given");
		}
		if (!bindToAdd.author) {
			return reject("No author was given");
		}
		if (!bindToAdd.text) {
			return reject("No text was given");
		}
		try {
			db.run(
				`INSERT INTO ${BINDS_DATABASE_REF} (author, text) VALUES (?, ?)`,
				[bindToAdd.author, bindToAdd.text],
				function (err, rows) {
					if (err) {
						return reject(err);
					}
					resolve(rows);
				}
			);
		} catch (error) {
			return reject(error);
		}
	});
};

const getBinds = async (db) => {
	return new Promise(function (resolve, reject) {
		db.all(`SELECT * FROM ${BINDS_DATABASE_REF}`, function (err, rows) {
			if (err) {
				return reject(err);
			}
			resolve(rows);
		});
	});
};

module.exports = { BINDS_DATABASE_REF, addBind, getBinds };

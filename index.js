var fs = require('fs')
var path = require('path')

function getPackageJson(dir, resolve, reject) {
	if (resolve) {
		try {
			var curr = path.resolve(dir, 'package.json')
			return fs.exists(curr, function (exists) {
				if (exists) {
					return resolve(curr)
				}
				var dirp = path.resolve(dir, '..')
				if (dirp === dir) {
					return reject()
				}
				return getPackageJson(dirp, resolve, reject)
			})
		} catch (err) {
			return reject(err)
		}
	}
	if (dir === undefined || dir === null) {
		dir = process.cwd()
	}
	return new Promise(function (resolve, reject) {
		getPackageJson(dir, resolve, reject)
	}).catch(function (err) {
		if (err) {
			throw err
		}
		throw new Error(path.resolve(dir, 'package.json') + ' not found.')
	})
}

function readJsonFile(jsonFile) {
	return new Promise(function (resolve, reject) {
		fs.readFile(jsonFile, function (err, buf) {
			if (err) {
				return reject(err)
			}
			try {
				buf = JSON.parse(buf.toString())
			} catch (err) {
				return reject(err)
			}
			resolve(buf)
		})
	})
}

function writeJsonFile(jsonFile, data) {
	return new Promise(function (resolve, reject) {
		try {
			data = JSON.stringify(data, null, 2)
		} catch (err) {
			return reject(err)
		}
		fs.writeFile(jsonFile, data, function (err) {
			if (err) {
				return reject(err)
			}
			resolve(jsonFile)
		})
	})
}

getPackageJson().then(function (jsonFile) {
	return readJsonFile(jsonFile).then(function (jsonData) {
		if (!jsonData.version) {
			throw new Error('version field not found at: ' + jsonFile)
		}
		var upv = jsonData.upv
		var num = 3
		if (Number.isInteger(upv)) {
			if (upv >=1 && upv <= 3) {
				num = upv
			}
		}
		var newVersion = jsonData.version.replace(/(\d+)\.(\d+)\.(\d+)/, function (_, arg1, arg2, arg3) {
			var arr = [arg1, arg2, arg3]
			arr[num-1] = 1 + parseInt(arr[num-1])
			return arr.join('.')
		})
		jsonData.version = newVersion
		return writeJsonFile(jsonFile, jsonData).then(function () {
			console.log(jsonData.name + '@' + newVersion)
		})
	})
})

function parse_option(text) {
    if (!text)
        return null;

    var key = null;
    var val = null;

    var tokens = text.split(/\=(.*)/, 2);

    if (tokens.length < 2) {
        key = tokens[0].trim();
    } else {
        key = tokens[0].trim();
        val = tokens[1].trim();
    }

    // parse inline comments for key
    var cmt_key = key.split(/\s(.*)/, 2);

    if (cmt_key.length == 2) {
        let rest = cmt_key[1].trim();

        if (rest[0] == "#" || rest[0] == ";") {
            // no value option
            key = cmt_key[0];
            val = null;
        }
    }

    if (val) {
        var cmt_val = val.split(/\s(.*)/, 2);

        if (cmt_val.length == 2) {
            let rest = cmt_val[1].trim();

            if (rest[0] == "#" || rest[0] == ";") {
                val = cmt_val[0];
            }
        }
    }

    return [key, val];
}

function parse_inline_comments(text) {
	var result = text;

	if (!text)
		return null;

	var cmt = text.split(/\s(.*)/, 2);

	if (cmt.length == 2) {
		let rest = cmt[1].trim();

		if (rest[0] == "#" || rest[0] == ";") {
			result = cmt[0];
		}
	}

	return result;
}

function parse_section(text) {
    if (!text)
        return null;

    var header = null;
    var tokens = text.match(/^\s*\[(.*)\](.*)/, 2);

    if (tokens) {
        header = tokens[1];

        if (!header)
            return null;

        let rest = tokens[2].trim();

        if (rest && !(rest[0] == "#" || rest[0] == ";"))
            return null;

        var cmt_header = header.split(/\s(.*)/, 2);

        if (cmt_header.length == 2) {
            let rest = cmt_header[1].trim();

            if (rest[0] == "#" || rest[0] == ";")
                return null;
        }

        return header;
    } else {
        return null;
    }
}

const parse = function(string) {
	var result = {};

	var str = string.split(/\r?\n/);

	var prev_section = null;
	var prev_option = null;

	for (var i = 0; i < str.length; i++) {
		let line = str[i].trim();

    if (!line)
      continue;

		if (line[0] == "#" || line[0] == ";")
			continue;

		let section = parse_section(line);

		if (section) {
			result[section] = {};
			prev_section = section;
		} else {
			let option = parse_option(line);

			if (option) {
				prev_option = option;

				if (prev_section) {
					result[prev_section][option[0]] = option[1];
				} else {
					result[option[0]] = option[1];
				}
			} else {
				// no value options
        if (prev_section) {
          result[prev_section][parse_inline_comments(line)] = null;
        } else {
          result[parse_inline_comments(line)] = null;
        }
			}
		}
	}

	return result;
}

module.exports.parse = parse;

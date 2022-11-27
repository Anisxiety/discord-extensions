const axios = require("axios");
const { createHash } = require("crypto");
function hash(url) {
    return createHash("sha256")
        .update(url + "#funny-salt")
        .digest("hex");
}

class AsyncConstructor {
	constructor(args) {
		return (async (inputs) => {
            let repoId = inputs?.at(0)
            let pluginId = inputs?.at(1)
	    if (!repoId) {
		this.content = "U need to add something to the command dummy"
		return;
	    }
	    let file = globalThis.events_src.filter(json => json.name == "repos.js")[0]
            let repo = requireFromString(file.code).find(it => it?.name === repoId || it?.sort === shortcut).url
            if (!repo && repoId.indexOf("http") !== -1) repo = repoId 
            let repoResponse = (await axios.get(repo, {
                headers: {
                    'accept-encoding': 'null'
                }
            })).data;
            let repoPlugins = []
            for (const pluginUrl of RepoResponse.pluginLists) {
                if (!pluginUrl || !pluginUrl.startsWith("http")) continue;
                (await axios.get(pluginUrl, {
                    headers: {
                        'accept-encoding': 'null'
                    }
                })).data.forEach((data) => {
                    repoPlugins.push(data);
                });
            }
            let plugin = repoPlugins.find(it => it?.name === pluginId || it?.internalName == pluginId)
            let url = "https://api.countapi.xyz/info/cs3-votes/" + hash(plugin?.url || repoId);
            let countReponse = (await axios.get(url)).data;
            this.embeds = [
                {
                    "title": "VoteAPI entry info",
                    "fields": (["Created", "TTL"].map(it=>({
                        "name": it,
                        "value": `<t:${countReponse[it.toLowerCase()]}:R>`,
                        "inline": false
                    })) + ["Value", "Update Lowerbound", "Update Upperbound"].map(it=>({
                        "name": it,
                        "value": `<t:${countReponse[it.toLowerCase().replace(/\s/g,"_")]}:R>`,
                        "inline": false
                    })))
                }
            ]
			return this;
		})();
	}
}
module.exports = AsyncConstructor

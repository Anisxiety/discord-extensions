const axios = require("axios")

// from https://github.com/danamag/stremio-addons-list/blob/main/lib/issueToMeta.js#L3
const issueToMeta = issue => {
    const meta = {
        name: issue.title,
        url: '',
        description: '',
        ups: 0,
        downs: 0,
        commentCount: 0,
        issueUrl: issue.url,
        proposedLabels: [],
        language: 'Multilingual',
    }
    const chunks = (issue.body || '').split(/\r?\n/)
    let readingFor = false
    chunks.forEach(chunk => {
        if (chunk === '### Addon Manifest URL')
            readingFor = 'url'
        else if (chunk === '### Addon Description')
            readingFor = 'description'
        else if (chunk === '### Language of Content')
            readingFor = 'language'
        else if (chunk === '### Choose Labels')
            readingFor = 'labels'
        else if (readingFor && chunk) {
            if (readingFor === 'url' && meta.url.endsWith('/manifest.json')) return;
            if (readingFor === 'labels' && chunk.toLowerCase().startsWith('- [x] ')) {
                meta.proposedLabels.push(chunk.replace('- [X] ', '').replace('- [x] ', '').trim())
                return
            }
            if (readingFor === 'language') {
                lang = chunk.split('; ')[0].split(' (')[0].trim()
                if (lang !== '_No response_')
                    meta[readingFor] = lang
                return
            }
            meta[readingFor] += chunk
            meta[readingFor] = meta[readingFor].trim()
        }
    })
    if (!meta.url.startsWith('https://') || !meta.url.endsWith('/manifest.json'))
        meta.url = ''
    if (meta.description === '_No response_')
        meta.description = ''
    if (meta.name && meta.url) {
        const reactionGroups = issue.reactionGroups || []
        meta.labels = (issue.labels || {}).nodes || []
        let score = 0
        reactionGroups.forEach(group => {
            if ((group.users || {}).totalCount) {
                if (group.content === 'THUMBS_UP') {
                    meta.ups = group.users.totalCount
                    score += group.users.totalCount
                } else if (group.content === 'THUMBS_DOWN') {
                    meta.downs = group.users.totalCount
                    score -= group.users.totalCount
                }
            }
        })
        meta.issueNumber = issue.number
        meta.commentCount = (issue.comments || {}).totalCount || 0
        meta.postId = issue.id
        meta.score = score
        return meta
    } else return false
}

class AsyncConstructor {
    constructor(value) {
        return (async () => {
            const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                arr.slice(i * size, i * size + size)
            );
            var allList = []
            var issues = (await axios.get("https://api.github.com/repos/danamag/stremio-addons-list/issues?state=open&per_page=100&labels=http+streams")).data
            for (const issue in issues) {
                try {
                    if (!issue) 
                        allList.push({
                            "name": "error",
                            "value": `empty-issue`,
                            "inline": false
                        })
                    var meta = issueToMeta(issue)
                    if (!meta) {
                        allList.push({
                            "name": "error",
                            "value": `no-meta`,
                            "inline": false
                        })
                        continue //meta = issueToMeta((await axios.get(issue.url)).data)
                    }
                        
                    if (meta.url) {
                        allList.push({
                            "name": meta.name,
                            "value": `\`${meta.url.replace(/\/manifest\.json$/gi, "")}\``,
                            "inline": false
                        })
                    }
                } catch (error) {
                       allList.push({
                            "name": "error",
                            "value": `${error}`,
                            "inline": false
                        })
                }
            }
            var allEmbeds = []
            chunk(allList, 12).forEach(data => {
                allEmbeds.push({
                    "title": "Stremio addons",
                    "fields": data,
                    "color": 8804262
                })
            })
            this.embeds = allEmbeds
            this.content = `You can install these by using the clone site feature. (Issue count: ${issues.length})`
            return this;
        })();
    }
}
module.exports = new AsyncConstructor()

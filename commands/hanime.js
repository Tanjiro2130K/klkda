const {tags,trending,getSlug,watch,hinfo} = require('../utils/hfunctions');
const { MessageMedia } = require('whatsapp-web.js');


module.exports = async function hanimeCommand(client, message) {
    try{
const utext = message.body.replace('.hanime ','').trim();
const words = utext.split(' ');
if(message.body=='.hanime'|| message.body=='.hanime '){
    const availableCmds = `These are the availabe commands\n\n\n.hanime trending\n\n.hanime tags\n\n.hanime get <tag>(.eg ahegao) <page>(.eg 3)\n\n.hanime watch <name>(.eg tsundero-2)\n\n.hanime info <name>(.eg tsundero-2)`;
    message.reply(availableCmds);
}else if(utext=="trending"){
    const trending_slugs = await trending();
    message.reply(`Today's Trending\n\n${trending_slugs}`);
}else if(words[0]=="get"){
    const tag = words[1];
    const page = words[2] || '0';
    console.log(tag,page);
    const slugs = await getSlug(tag, page);
    await message.reply(`Available slugs for tag *${tag}*\n\n${slugs}`)
}else if(words[0]=="watch"){
    const slug = words[1];
    const video = await watch(slug);
    const media = await MessageMedia.fromUrl(video);
    client.sendMessage(message.from, media, {sendMediaAsDocument: true, caption:`Here's video link\n${video}`} );
}else if(words[0]=="info"){
    await message.reply("Collecting data...")
    const slug = words[1];
    const info = await hinfo(slug);
    const img = info.img;
    const name = info.name;
    const description = info.desc.replace('<p>','');
    const views = info.views;
    const media = await MessageMedia.fromUrl(img);
    const captionMessage = `*name:* ${name}\n*views:* ${views}\n\n*description:* ${description.replace('</p>','')}`
    await client.sendMessage(message.from, media, {caption: captionMessage});
}else if(words[0]=="tags"){
    let all_tags = await tags();
    await message.reply(`Available Tags\n\n${all_tags}`);
}
}catch(error){
        console.error(error);
        await message.reply("something went wrong ```001```")
    }
}
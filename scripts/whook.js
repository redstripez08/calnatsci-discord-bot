const fetch = require("node-fetch");
const readline = require("readline");
const { webhook } = require("../secret.json");

const originLink = "https://discord.com";
const link = new URL(`/api/webhooks/${webhook.id}/${webhook.token}`, originLink);
link.search = new URLSearchParams({wait: true}).toString();
link.options = {
    method: 'POST',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
};

(() => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Enter announcment title: ", (title) => {
            rl.question("Enter announcement:\n", async(announcement) => {
                rl.close();

                const charCounter = (str, max = 2048) => str > max ? `${str.slice(0, max - 3)}...` : str;
                link.options.body = JSON.stringify({
                    "username": "CalNatSci | Webhook",
                    "avatar_url": "https://i.imgur.com/kBKuF03.png",
                    "embeds": [
                        {
                            "color": 9175173,
                            "title": charCounter(title, 256),
                            "type": "rich",
                            "description": announcement,
                        }
                    ]
                });
    
                try {
                    const res = await fetch(link, link.options);
                    if (!res.ok) throw res.status, res.statusText, res.error;
                    const data = await res.json();
                    if (!data) throw "Error, not sent.", data;
                    console.log("\nAnnouncment Sent");
                } catch (error) {
                    console.error(error);
                }

            });
        });
})();
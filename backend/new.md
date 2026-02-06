## POST
{
    _id : post ki id,
    user : {
        id : user ki id jisne post dali,
        username : jisne post dali uska username
    },
    text : "post ka text",
    image : "post ki image",
    likes : [79832789,63827964,...,users_ki_id],
    comments : [
        {
            user : {
                id : user jisne comment kra uski id(eg:which are in likes).
                username : jisne comment kra uska usernme
            },
            text : "user ne joh comment kra",
            _id : "kuch toh hai"
        }
    ]
}
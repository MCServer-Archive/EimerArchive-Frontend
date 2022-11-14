import axios from "axios";

export default async function (context) {

    const token = context.app.$cookies.get('token');

    try {
        const user = await axios.post(`${process.env.apiURL}/api/auth/info`, {"user-cookie": token});

        console.log(user.data);

        await context.store.dispatch('auth/fetchUser', {
            token: token,
            'user': user.data
        })

        if (routeOption(context.route, 'auth', true) && context.store.state.auth.user.role !== 'ADMIN') {
            return context.redirect('/login')
        }
    } catch (e) {
        console.error("Error: ", e);
    }
}

function routeOption(route, key, value) {
    return route.matched.some((m) => {
        if (process.client) {
            return Object.values(m.components).some(
                (component) => component.options && component.options[key] === value
            )
        } else {
            return Object.values(m.components).some((component) =>
                Object.values(component._Ctor).some(
                    (ctor) => ctor.options && ctor.options[key] === value
                )
            )
        }
    })
}
export type User = {
    handle: string
    name: string
    email: string
    _id: string
    description: string
}

export type RegisterForm = Pick<User, 'handle' | 'email' | 'name'> & {
    password: string
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
    password:string
}

export type SocialNetwork = {
    id:number,
    name:string,
    url:string,
    enable:boolean
}

export type DevTreeLink = Pick<SocialNetwork, 'name' | 'url' | 'enable'>
export type ProfileForm = Pick<User, 'handle' | 'description'>

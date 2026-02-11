interface User {
  id: string
  email: string
  name: string
  role: string
  password: string
}


const users: User[] = [
  {
    id: "1",
    email: "wowdash@gmail.com",
    name: "Wowdash",
    role: "Admin",
    password: "Pa$$w0rd!"
  },
  {
    id: "2",
    email: "recepcion@hotel-demo.com",
    name: "Camila Rojas",
    role: "Recepción",
    password: "Demo#2026"
  },
  {
    id: "3",
    email: "housekeeping@hotel-demo.com",
    name: "Luis Salazar",
    role: "Housekeeping",
    password: "Demo#2026"
  },
  {
    id: "4",
    email: "finanzas@hotel-demo.com",
    name: "Paula Torres",
    role: "Finanzas",
    password: "Demo#2026"
  },
  {
    id: "5",
    email: "gerencia@hotel-demo.com",
    name: "Mario Vega",
    role: "Gerencia",
    password: "Demo#2026"
  }
]

export async function getUserFromDb(email: string, hashedPassword: string): Promise<User | null> {
  const find = users.find(user => user.email === email && user.password === hashedPassword)
  return find || null
}

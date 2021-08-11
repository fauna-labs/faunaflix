// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

const faunadb = require('faunadb')

const q = faunadb.query
const { If, IsEmpty,
  Collection,  Index, Function,
  Let, Select, Var, Call, Paginate, Get, Match, Create } = q

const client = new faunadb.Client({
  secret: process.env.FAUNA_ADMIN_KEY,
  domain: process.env.VUE_APP_FAUNA_DOMAIN || 'db.fauna.com' 
})

async function LoadCategories(name) {
  await client.query(
    If(
      IsEmpty(Paginate(Match(Index("categories_by_name"), name))),
      Create(Collection("Categories"), { data: { name: name } }),
      true
    )    
  );
}

const categories = [
  'All Ages',
  'Animation',
  'Spanish',
  'Ages 2-5',
  'Popular',
  'New Releases',
  'Ages 5+'
]

const shows = [
  {
    name: "Magic Schoolbus",
    url: "",
    image: "https://i.ytimg.com/sh/zJ_tWZV1saIgIrK4kbo8Ug/market.jpg",
    categories: ["Animation", "Ages 5+"],
    parent: null
  },
  {
    name: "Carl's Carwash",
    url: "",
    image: "http://i3.ytimg.com/vi/U6GbA2anX4o/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: null
  },
  {
    name: "Bumblenums",
    url: "",
    image: "http://i3.ytimg.com/vi/IasifOgqbfA/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: null
  },
  {
    name: "Monkey Mechanic",
    url: "",
    image: "https://i.ytimg.com/vi/O21G7hAS_cg/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "New Releases", "Popular"],
    parent: null
  },
  {
    name: "Octonauts The Movie",
    url: "https://www.youtube.com/embed/KeCq9kxXu2M",
    image: "http://i3.ytimg.com/vi/KeCq9kxXu2M/maxresdefault.jpg",
    categories: ["Animation", "Ages 5+"],
    parent: null
  },
  {
    name: "The Electric Company",
    url: "",
    image: "http://i3.ytimg.com/vi/SLdhGK_E0eA/maxresdefault.jpg",
    categories: ["Ages 2-5", "All Ages", "Ages 5+"],
    parent: null
  },
  {
    name: "3 2 1 Contact Marathon",
    url: "https://www.youtube.com/embed/s2-LEBc2sO8",
    image: "http://i3.ytimg.com/vi/s2-LEBc2sO8/hqdefault.jpg",
    categories: ["Ages 2-5", "All Ages", "Ages 5+"],
    parent: null
  },
  {
    name: "Fraggle Rock",
    url: "",
    image: "http://i3.ytimg.com/vi/KLQS6xo40kI/maxresdefault.jpg",
    categories: ["Ages 2-5", "All Ages"],
    parent: null
  },
  {
    name: "Sesame Street Elmo's Christmas Countdown",
    url: "https://www.youtube.com/embed/L_BrgoRHMrw",
    image: "http://i3.ytimg.com/vi/L_BrgoRHMrw/hqdefault.jpg",
    categories: ["Ages 2-5", "Popular"],
    parent: null
  },
  {
    name: "English Sing Sing Movie",
    url: "https://www.youtube.com/embed/8irSFvoyLHQ",
    image: "https://i.ytimg.com/vi/P12Ta681-gc/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Spanish"],
    parent: null
  },
  {
    name: "Cocomelon",
    url: "",
    image: "http://i3.ytimg.com/vi/LbHnkpecXFU/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: null
  }
]

async function CreateTestUser() {
  const testUser = {
    name: 'Flix User',
    email: 'flixuser@mailinator.com',
    subscription: 'Active'
  }
  
  await client.query(
    If(
      IsEmpty(Paginate(Match(Index('users_by_email'), testUser.email))),
      Create(
        Collection("Users"),
        {
          data: testUser,
          credentials: {
            password: "fauna123#"
          }
        }
      ),
      true
    )
  )
}

async function LoadShows(ep) {
  await client.query(
    Call(Function('AddOrUpdateEpisode'), [ep.name, ep.url, ep.image, ep.categories, ep.parent]),
  )
}

const episodes = [
  {
    name: "Magic Schoolbus Ep. 1",
    url: "https://www.youtube.com/embed/J7D3bOOexf0",
    image: "http://i3.ytimg.com/vi/coJ0bXPKebE/hqdefault.jpg",
    categories: ["Animation", "Ages 2-5"],
    parent: "Magic Schoolbus"
  },
  {
    name: "Magic Schoolbus Ep. 2",
    url: "https://www.youtube.com/embed/2aectu_oWM8",
    image: "http://i3.ytimg.com/vi/2aectu_oWM8/hqdefault.jpg",
    categories: ["Animation", "Ages 2-5"],
    parent: "Magic Schoolbus"
  },
  {
    name: "Magic Schoolbus Ep. 3",
    url: "https://www.youtube.com/embed/v53mhRXXT2g",
    image: "http://i3.ytimg.com/vi/v53mhRXXT2g/hqdefault.jpg",
    categories: ["Ages 2-5"],
    parent: "Magic Schoolbus"
  },
  {
    name: "Monkey Mechanic Ep. 1",
    url: "https://www.youtube.com/embed/tUTyS0Bz4Ho",
    image: "http://i3.ytimg.com/vi/tUTyS0Bz4Ho/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "New Releases", "Popular"],
    parent: "Monkey Mechanic"
  },
  {
    name: "Monkey Mechanic Ep. 2",
    url: "https://www.youtube.com/embed/ZFIqtlcDYzM",
    image: "http://i3.ytimg.com/vi/ZFIqtlcDYzM/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "New Releases", "Popular"],
    parent: "Monkey Mechanic"
  },  
  {
    name: "Monkey Mechanic Ep. 3",
    url: "https://www.youtube.com/embed/w1IbqGsKUsM",
    image: "http://i3.ytimg.com/vi/w1IbqGsKUsM/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "New Releases", "Popular"],
    parent: "Monkey Mechanic"
  },
  {
    name: "Monkey Mechanic Ep. 4",
    url: "https://www.youtube.com/embed/RNaOm70AHgg",
    image: "http://i3.ytimg.com/vi/RNaOm70AHgg/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "New Releases", "Popular"],
    parent: "Monkey Mechanic"
  },
  {
    name: "Monkey Mechanic Ep. 5",
    url: "https://www.youtube.com/embed/kYKvQ5qi55Y",
    image: "http://i3.ytimg.com/vi/kYKvQ5qi55Y/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "New Releases", "Popular"],
    parent: "Monkey Mechanic"
  },
  {
    name: "Bumblenums Ep. 1",
    url: "https://www.youtube.com/embed/IasifOgqbfA",
    image: "http://i3.ytimg.com/vi/IasifOgqbfA/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Bumblenums"
  },
  {
    name: "Bumblenums Ep. 2",
    url: "https://www.youtube.com/embed/CrBh39G0DiM",
    image: "http://i3.ytimg.com/vi/CrBh39G0DiM/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Bumblenums"
  },
  {
    name: "Bumblenums Ep. 3",
    url: "https://www.youtube.com/embed/ALhsvN0RrFY",
    image: "http://i3.ytimg.com/vi/ALhsvN0RrFY/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Bumblenums"
  },
  {
    name: "Bumblenums Ep. 4",
    url: "https://www.youtube.com/embed/CBQetUSRTU0",
    image: "http://i3.ytimg.com/vi/CBQetUSRTU0/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Bumblenums"
  },
  {
    name: "Bumblenums Ep. 5",
    url: "https://www.youtube.com/embed/LimAQ0-XuX4",
    image: "http://i3.ytimg.com/vi/LimAQ0-XuX4/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Bumblenums"
  },
  {
    name: "Bumblenums Ep. 6",
    url: "https://www.youtube.com/embed/k_Yc6IdZIJ8",
    image: "http://i3.ytimg.com/vi/k_Yc6IdZIJ8/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Bumblenums"
  },
  {
    name: "Electric Company Ep. 1",
    url: "https://www.youtube.com/embed/SLdhGK_E0eA",
    image: "http://i3.ytimg.com/vi/SLdhGK_E0eA/maxresdefault.jpg",
    categories: ["Ages 2-5", "All Ages", "Ages 5+"],
    parent: "The Electric Company"
  },
  {
    name: "Electric Company Ep. 2",
    url: "https://www.youtube.com/embed/YibMg1Lvk9Y",
    image: "http://i3.ytimg.com/vi/YibMg1Lvk9Y/maxresdefault.jpg",
    categories: ["Ages 2-5", "All Ages", "Ages 5+"],
    parent: "The Electric Company"
  },
  {
    name: "Electric Company Ep. 3",
    url: "https://www.youtube.com/embed/ovuBDYDVuPU",
    image: "http://i3.ytimg.com/vi/ovuBDYDVuPU/maxresdefault.jpg",
    categories: ["Ages 2-5", "All Ages", "Ages 5+"],
    parent: "The Electric Company"
  },
  {
    name: "Fraggle Rock Ep. 1",
    url: "https://www.youtube.com/embed/PECSi2deb1g",
    image: "http://i3.ytimg.com/vi/KLQS6xo40kI/maxresdefault.jpg",
    categories: ["Ages 2-5", "All Ages"],
    parent: "Fraggle Rock"
  },
  {
    name: "Fraggle Rock Ep. 2",
    url: "https://www.youtube.com/embed/WF5WTN0v1g0",
    image: "http://i3.ytimg.com/vi/WF5WTN0v1g0/hqdefault.jpg",
    categories: ["Ages 2-5", "All Ages"],
    parent: "Fraggle Rock"
  },
  {
    name: "Fraggle Rock Ep. 3",
    url: "https://www.youtube.com/embed/V-WtZf-RnOM",
    image: "http://i3.ytimg.com/vi/V-WtZf-RnOM/hqdefault.jpg",
    categories: ["Ages 2-5", "All Ages"],
    parent: "Fraggle Rock"
  },
  {
    name: "Fraggle Rock Ep. 4",
    url: "https://www.youtube.com/embed/sZI6FKrSxnk",
    image: "http://i3.ytimg.com/vi/sZI6FKrSxnk/hqdefault.jpg",
    categories: ["Ages 2-5", "All Ages"],
    parent: "Fraggle Rock"
  },
  {
    name: "Fraggle Rock Ep. 5",
    url: "https://www.youtube.com/embed/bbyrbV7ddaI",
    image: "http://i3.ytimg.com/vi/bbyrbV7ddaI/hqdefault.jpg",
    categories: ["Ages 2-5", "All Ages"],
    parent: "Fraggle Rock"
  },
  {
    name: "Cocomelon Ep. 1",
    url: "https://www.youtube.com/embed/LbHnkpecXFU",
    image: "http://i3.ytimg.com/vi/LbHnkpecXFU/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 2",
    url: "https://www.youtube.com/embed/qXcMNBQnQMM",
    image: "http://i3.ytimg.com/vi/qXcMNBQnQMM/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 3",
    url: "https://www.youtube.com/embed/Qt3oQSSZv-o",
    image: "http://i3.ytimg.com/vi/Qt3oQSSZv-o/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 4",
    url: "https://www.youtube.com/embed/7i68cD70dEE",
    image: "http://i3.ytimg.com/vi/7i68cD70dEE/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 5",
    url: "https://www.youtube.com/embed/vCWjK_z5tuM",
    image: "http://i3.ytimg.com/vi/vCWjK_z5tuM/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 6",
    url: "https://www.youtube.com/embed/TM1wT5NC3XQ",
    image: "http://i3.ytimg.com/vi/TM1wT5NC3XQ/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 7",
    url: "https://www.youtube.com/embed/Gmrj5-70xV4",
    image: "http://i3.ytimg.com/vi/Gmrj5-70xV4/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 8",
    url: "https://www.youtube.com/embed/UGtBdaNn4p4",
    image: "http://i3.ytimg.com/vi/UGtBdaNn4p4/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 9",
    url: "https://www.youtube.com/embed/h5EOvWV1uQo",
    image: "http://i3.ytimg.com/vi/h5EOvWV1uQo/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Cocomelon Ep. 10",
    url: "https://www.youtube.com/embed/_BcBHTHvOVo",
    image: "http://i3.ytimg.com/vi/_BcBHTHvOVo/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "All Ages", "Popular"],
    parent: "Cocomelon"
  },
  {
    name: "Carl's Carwash Ep. 1",
    url: "https://www.youtube.com/embed/U6GbA2anX4o",
    image: "http://i3.ytimg.com/vi/U6GbA2anX4o/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Carl's Carwash"
  },    
  {
    name: "Carl's Carwash Ep. 2",
    url: "https://www.youtube.com/embed/gEupWLu1U6U",
    image: "http://i3.ytimg.com/vi/gEupWLu1U6U/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Carl's Carwash"
  },
  {
    name: "Carl's Carwash Ep. 3",
    url: "https://www.youtube.com/embed/GBm0irsT5FA",
    image: "http://i3.ytimg.com/vi/GBm0irsT5FA/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Carl's Carwash"
  },
  {
    name: "Carl's Carwash Ep. 4",
    url: "https://www.youtube.com/embed/9caxba8KRkE",
    image: "http://i3.ytimg.com/vi/9caxba8KRkE/maxresdefault.jpg",
    categories: ["Animation", "Ages 2-5", "Popular"],
    parent: "Carl's Carwash"
  }
]

const previews = [
  "Magic Schoolbus Ep. 3",
  "Octonauts The Movie",
  "Electric Company Ep. 1",
  "Cocomelon Ep. 1",
  "Carl's Carwash Ep. 3",
  "Monkey Mechanic Ep. 5",
  "Monkey Mechanic Ep. 3",
  "Fraggle Rock Ep. 1",
  "Cocomelon Ep. 9",
  "Electric Company Ep. 3"
]

async function LoadPreviews(show) {
  await client.query(
    Let(
      {
        ref: Select(["ref"], Get(Match(Index("shows_by_name"), show))),
        match: Match(Index('no_duplicate_previews'), Var("ref")),
        paginate: Paginate(Var("match")),
        empty: IsEmpty(Var("paginate"))
      },
      If(
        Var("empty"),
        Create(
          Collection("Previews"),
          {
            data: {
              show: Var("ref")
            }
          }
        ),
        true
      )
    )
  )
}

const main = async () => {
  console.log('create test user');
  CreateTestUser()

  for (const c of categories) {
    console.log(`create category ${c}`);
    await LoadCategories(c);
  }

  for (const s of shows) {
    console.log(`create show ${s.name}`);
    await LoadShows(s);
  }  

  for (const ep of episodes) {
    console.log(`adding episode ${ep.name}`);
    await LoadShows(ep)
  }

  for (const p of previews) {
    console.log(`adding preview ${p}`);
    LoadPreviews(p)
  }
}

main()
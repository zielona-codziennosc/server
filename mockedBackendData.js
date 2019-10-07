export default {
  id: "hehehehehehehehe",
  name: "API jeden",
  units: {
    "idNumberOne": {
      type: "resource",
      endpoints: {
        "get_all": { id: "1", method: "GET", path: "/", description: "get all products", secured: false },
        "post_one": {
          id: "2",
          method: "POST",
          path: "/",
          description: "add a new product",
          body: "{\"name\":\"String\",\"price\":\"Number\",\"brand\":\"String\"}",
          secured: true
        },
        "get_single": {
          id: "3",
          method: "GET", path: "/:productId",
          description: "get single product",
          params: { "productId": "Id of the queried product" },
          secured: false,
          body: "{}"
        },
      },
      name: "products",
      path: "/products"
    },
    "idNumberTwo": {
      type: "resource",
      endpoints: {
        "get_all": { method: "GET", path: "/", description: "get all users", secured: true },
        "post_one": {
          method: "POST",
          path: "/",
          description: "add a new user",
          body: "{\"email\":\"String\",\"password\":\"String\"}",
          secured: true
        },
        "get_single": {
          method: "GET", path: "/:userId",
          description: "get a single user",
          params: { "userId": "Id of the queried user" },
          secured: true,
          body: "{}"
        },
      }
      ,
      name: "users",
      path: "/users"
    },
    "idNumberThree": {
      type: "authentication",
      name: "authentication",
      path: "/auth",
      endpoints: {
        "login": {
          method: "POST",
          path: "/login",
          description: "login with credentials",
          body: "{\"email\":\"String\",\"password\":\"String\",\"req\":{\"hehe\": {\"hehe\":\"hehe\"}}}"
        },
        "register": {
          method: "POST",
          path: "/register",
          description: "register with credentials",
          body: "{\"email\":\"String\",\"password\":\"String\"}"
        },
        "logout": {
          method: "POST",
          path: "/logout",
          description: "logout based on the Authorization header",
          body: "{}"
        }
      }
      ,
      thirdParty: false,
      description: "A JWT based authentication with 3 basic endpoints."
    },
    "idNumberFour": {
      type: "miscellaneous",
      endpoints: {
        "get_static": {
          id: "jeden",
          method: "GET",
          path: "/static/:fileName",
          description: "static files",
          secured: false,
          params: {fileName: "self explanatory"},
          body: "{}"
        },
      },
      name: "utility single endpoints"
    }
  }
}

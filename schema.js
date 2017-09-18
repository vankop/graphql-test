var {
    makeExecutableSchema,
    addMockFunctionsToSchema,
    MockList
} = require('graphql-tools');
var {mappingId} = require('./utils/schemaUtils');
var names = require('./data/names.json');
var departments = require('./data/departments.json');
var {randomInt} = require('./utils/randomInt');

function oneOf(type) {
    return type[randomInt(0, type.length - 1)]
}

const typeDefs = `
  enum Role {
    ADMIN
    NORMAL
  }
  
  type Employee {
    id: Int,
    name: String!,
    active: Boolean,
    roles: [Role!]
  }
  
  type Department {
    id: Int,
    name: String!,
    employees: [Employee!]
    departments: [Department!]
  }

  type Query {
    get_department(id: Int): Department,
    get_employee(id: Int): Employee
  }
`;

var schema = makeExecutableSchema({ typeDefs });

const mocks = {
    Department: () => ({
        name: oneOf.bind(null, departments),
        employees: () => new MockList([2, 10]),
        departments: () => new MockList([0, 4])
    }),
    Query: () => ({
        get_department: (...args) => Object.assign({}, mappingId(...args), {
            name: "My Company"
        }),
        get_employee: mappingId
    }),
    Employee: () => ({
        name: oneOf.bind(null, names),
        roles: () => Math.random() < 0.16 ? ["NORMAL", "ADMIN"] : ["NORMAL"]
    })
};

addMockFunctionsToSchema({ schema, mocks });

module.exports = {
    schema
};

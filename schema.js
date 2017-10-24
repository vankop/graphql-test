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
  
  enum DisplayNameFormat {
    FIRST_SECOND,
    SECOND_FIRST
  }
  
  type Employee {
    displayNameFormat: DisplayNameFormat
  }
  
  type AppConfig {
    employee: Employee
  }
  
  type mutation_AppConfig {
    employee(displayNameFormat: DisplayNameFormat): Employee
  }
  
  type Employee1 {
    id: Int,
    name: String!,
    active: Boolean,
    roles: [Role!]
  }
  
  type Department {
    id: Int,
    name: String!,
    employees: [Employee1!]
    departments: [Department!]
  }

  type Query {
    get_department(id: Int): Department,
    get_employee(id: Int): Employee,
    appConfig: AppConfig
  }
  
  type Mutation {
    appConfig: mutation_AppConfig
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

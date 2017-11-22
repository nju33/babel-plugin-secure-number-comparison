import {transform} from 'babel-core';
import template from 'babel-template';
import generate from 'babel-generator';
import * as t from 'babel-types';

const buildRequire = template(`
  if (LEFT_NODE == RIGHT_NODE) {

  }
`);


const Type = {
  IDENTIFIER: 'Identifier',
  NUMERIC_LITERAL: 'NumericLiteral',
};

const isTargetOperator = (operator) => {
  return operator === '==' || operator === '!=' || operator === '>' || operator === '>=' || operator === '<=' || operator === '<';
}

const plugin = ({types: t}) => ({

//   trailingComments: [],
// leadingComments: [],
// innerComments: [],
// [Symbol()]: true }
// 9
// util.js:114
//   return `'${str.replace(strEscapeSequencesReplacer, escapeFn)}'`;

  name: 'secure-number-comparison',
  visitor: {
    BinaryExpression: nodePath => {

      // console.log(nodePath.node)
      // const ifStatementNodePath = nodePath.get('IfStatement')
      // console.log(ifStatement.node)
      // console.log(ifStatementNodePath.node)
      // console.log(nodePath)
      // console.log(nodePath.get('BinaryExpression'));

      if (isTargetOperator(nodePath.node.operator)) {
        const leftNode = nodePath.node.left;
        const rightNode = nodePath.node.right;

        if (leftNode.type === Type.IDENTIFIER && rightNode.type === Type.NUMERIC_LITERAL) {
          const ast = buildRequire({
            LEFT_NODE: t.identifier(`Number(${leftNode.name})`),
            RIGHT_NODE: rightNode
          });

          // console.log(ast)

          nodePath.replaceWith(ast);
          // nodePath.skip();
        }
      }
    }
  }
});

// const ast = buildRequire({
//   FOO: t.identifier('Number(foo)')
// });

// console.log(generate(ast).code);
// console.log(generate(ast))
const src = `
  if (foo == 123) {
    console.log(123);
  }
  if (foo == 123) {
    console.log(123);
  }
`;

const {code} = transform(src, {plugins: [plugin]});
console.log(code)
// console.log(code); // --> 1 * 2;

//
// const src = `
//   if (foo == 123) {
//     console.log(123);
//   }
//
// `;
//
// const plugin = ({types: t}) => ({
//   visitor: {
//     BinaryExpression: nodePath => {
//       console.log(nodePath.node)
//       if (nodePath.node.operator !== '*') {
//         const newAst = t.binaryExpression(
//           '*',
//           nodePath.node.left,
//           nodePath.node.right
//         );
//         nodePath.replaceWith(newAst);
//       }
//     }
//   }
// });
//
// const {code} = transform(src, {plugins: [plugin]});
// console.log(code); // --> 1 * 2;
// import * as babylon from "babylon";
// import traverse from "babel-traverse";
//
// const code = `
// if (foo == 1) {
//   console.log(123);
// }
// `;
//
// const ast = babylon.parse(code);
//
// traverse(ast, {
//   enter(path) {
//     if (path.node.type === 'IfStatement') {
//       console.log(path.node)
//     }
//     console.log(path.node.type);
//     console.log(path.node.name);
//     console.log('---')
//   }
// })
//

// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }

// import {transform} from '@babel/core';

const Type = {
  IDENTIFIER: 'Identifier',
  NUMERIC_LITERAL: 'NumericLiteral'
};

const isTargetOperator = operator => {
  return (
    operator === '==' ||
    operator === '!=' ||
    operator === '>' ||
    operator === '>=' ||
    operator === '<=' ||
    operator === '<'
  );
};

const plugin = ({types: t}) => ({
  name: 'secure-number-comparison',
  visitor: {
    BinaryExpression: nodePath => {
      if (isTargetOperator(nodePath.node.operator)) {
        const leftNode = nodePath.node.left;
        const rightNode = nodePath.node.right;

        if (
          leftNode.type === Type.IDENTIFIER &&
          rightNode.type === Type.NUMERIC_LITERAL
        ) {
          nodePath.node.left = t.identifier(
            `Number(${nodePath.node.left.name})`
          );
          if (nodePath.node.operator === '==') {
            nodePath.node.operator = '===';
          } else if (nodePath.node.operator === '!=') {
            nodePath.node.operator = '!==';
          }
        } else if (
          leftNode.type === Type.NUMERIC_LITERAL &&
          rightNode.type === Type.IDENTIFIER
        ) {
          nodePath.node.right = t.identifier(
            `Number(${nodePath.node.right.name})`
          );
          if (nodePath.node.operator === '==') {
            nodePath.node.operator = '===';
          } else if (nodePath.node.operator === '!=') {
            nodePath.node.operator = '!==';
          }
        }
      }
    }
  }
});

export default plugin;

// const src = `
//   if (foo == 123) {
//     console.log(123);
//
//     if (foo == 123) {
//       console.log(123);
//     }
//
//     if (foo != 123) {
//       console.log(123);
//     }
//   }
//   if (123 == bar) {
//     console.log(123);
//   }
// `;
//
// const {code} = transform(src, {plugins: [plugin]});
// console.log(code);

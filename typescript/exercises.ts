import { open } from "node:fs/promises"
import { createReadStream } from 'fs';
import * as readline from 'readline';

export function change(amount: bigint): Map<bigint, bigint> {
  if (amount < 0) {
    throw new RangeError("Amount cannot be negative")
  }
  let counts: Map<bigint, bigint> = new Map()
  let remaining = amount
  for (const denomination of [25n, 10n, 5n, 1n]) {
    counts.set(denomination, remaining / denomination)
    remaining %= denomination
  }
  return counts
}

export function firstThenApply<T, U> (items: T[], predicate: (item: T) => boolean, consumer: (item: T) => U): U | undefined {
  const result = items.find((item) => predicate(item))
  return result ? consumer(result) : undefined
}


export function* powersGenerator(base: bigint): Generator<bigint> {
  for (let power = 1n; ; power *= base) {
    yield power
  }
}




export async function countValidLines(filePath: string): Promise<number> {
    const fileStream = createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let lineCount = 0;
    for await (const line of rl) {
        const trimmedLine = line.trim();
        if (trimmedLine !== '' && !trimmedLine.startsWith('#')) {
            lineCount++;
        }
    }

    return lineCount;
}



interface Sphere {
  kind: "Sphere";
  radius: number;
}

interface Box {
  kind: "Box";
  width: number;
  length: number;
  depth: number;
}

export type Shape = Sphere | Box;

// Type guard function
function isSphere(shape: Shape): shape is Sphere {
  return shape.kind === "Sphere";
}

export function volume(shape: Shape): number {
  if (isSphere(shape)) {
    return (4 / 3) * Math.PI * (shape.radius ** 3);
  } else {
    return shape.width * shape.length * shape.depth;
  }
}

export function surfaceArea(shape: Shape): number {
  if (isSphere(shape)) {
    return 4 * Math.PI * (shape.radius ** 2);
  } else {
    return 2 * (shape.width * shape.length + shape.length * shape.depth + shape.depth * shape.width);
  }
}




export interface BinarySearchTree<T> {
  size(): number;
  insert(value: T): BinarySearchTree<T>;
  contains(value: T): boolean;
  inorder(): Iterable<T>;
  toString(): string;
}

class Node<T> implements BinarySearchTree<T> {
  private readonly left: BinarySearchTree<T>;
  private readonly right: BinarySearchTree<T>;
  private readonly nodeValue: T;
  private readonly nodeSize: number;

  constructor(value: T, left: BinarySearchTree<T> = new Empty<T>(), right: BinarySearchTree<T> = new Empty<T>()) {
      this.nodeValue = value;
      this.left = left;
      this.right = right;
      this.nodeSize = left.size() + 1 + right.size();
  }

  size(): number {
      return this.nodeSize;
  }

  insert(value: T): BinarySearchTree<T> {
      if (value < this.nodeValue) {
          return new Node(this.nodeValue, this.left.insert(value), this.right);
      } else if (value > this.nodeValue) {
          return new Node(this.nodeValue, this.left, this.right.insert(value));
      } else {
          return this; // value is already in the tree
      }
  }

  contains(value: T): boolean {
      if (value < this.nodeValue) return this.left.contains(value);
      else if (value > this.nodeValue) return this.right.contains(value);
      else return true;
  }

  *inorder(): Iterable<T> {
      yield* this.left.inorder();
      yield this.nodeValue;
      yield* this.right.inorder();
  }

  toString(): string {
      return `[${[...this.inorder()].join(", ")}]`;
  }
}

class Empty<T> implements BinarySearchTree<T> {
  size(): number {
      return 0;
  }

  insert(value: T): BinarySearchTree<T> {
      return new Node(value);
  }

  contains(_value: T): boolean {
      return false;
  }

  *inorder(): Iterable<T> {}

  toString(): string {
      return "[]";
  }
}

export { Empty };

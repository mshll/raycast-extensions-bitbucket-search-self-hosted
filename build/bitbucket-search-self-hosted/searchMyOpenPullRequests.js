"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/web-streams-polyfill/dist/ponyfill.es2018.js
var require_ponyfill_es2018 = __commonJS({
  "node_modules/web-streams-polyfill/dist/ponyfill.es2018.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? factory(exports2) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.WebStreamsPolyfill = {}));
    })(exports2, function(exports3) {
      "use strict";
      function noop2() {
        return void 0;
      }
      function typeIsObject(x2) {
        return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
      }
      const rethrowAssertionErrorRejection = noop2;
      function setFunctionName(fn, name) {
        try {
          Object.defineProperty(fn, "name", {
            value: name,
            configurable: true
          });
        } catch (_a2) {
        }
      }
      const originalPromise = Promise;
      const originalPromiseThen = Promise.prototype.then;
      const originalPromiseReject = Promise.reject.bind(originalPromise);
      function newPromise(executor) {
        return new originalPromise(executor);
      }
      function promiseResolvedWith(value) {
        return newPromise((resolve) => resolve(value));
      }
      function promiseRejectedWith(reason) {
        return originalPromiseReject(reason);
      }
      function PerformPromiseThen(promise, onFulfilled, onRejected) {
        return originalPromiseThen.call(promise, onFulfilled, onRejected);
      }
      function uponPromise(promise, onFulfilled, onRejected) {
        PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
      }
      function uponFulfillment(promise, onFulfilled) {
        uponPromise(promise, onFulfilled);
      }
      function uponRejection(promise, onRejected) {
        uponPromise(promise, void 0, onRejected);
      }
      function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
        return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
      }
      function setPromiseIsHandledToTrue(promise) {
        PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
      }
      let _queueMicrotask = (callback) => {
        if (typeof queueMicrotask === "function") {
          _queueMicrotask = queueMicrotask;
        } else {
          const resolvedPromise = promiseResolvedWith(void 0);
          _queueMicrotask = (cb) => PerformPromiseThen(resolvedPromise, cb);
        }
        return _queueMicrotask(callback);
      };
      function reflectCall(F2, V, args) {
        if (typeof F2 !== "function") {
          throw new TypeError("Argument is not a function");
        }
        return Function.prototype.apply.call(F2, V, args);
      }
      function promiseCall(F2, V, args) {
        try {
          return promiseResolvedWith(reflectCall(F2, V, args));
        } catch (value) {
          return promiseRejectedWith(value);
        }
      }
      const QUEUE_MAX_ARRAY_SIZE = 16384;
      class SimpleQueue {
        constructor() {
          this._cursor = 0;
          this._size = 0;
          this._front = {
            _elements: [],
            _next: void 0
          };
          this._back = this._front;
          this._cursor = 0;
          this._size = 0;
        }
        get length() {
          return this._size;
        }
        // For exception safety, this method is structured in order:
        // 1. Read state
        // 2. Calculate required state mutations
        // 3. Perform state mutations
        push(element) {
          const oldBack = this._back;
          let newBack = oldBack;
          if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
            newBack = {
              _elements: [],
              _next: void 0
            };
          }
          oldBack._elements.push(element);
          if (newBack !== oldBack) {
            this._back = newBack;
            oldBack._next = newBack;
          }
          ++this._size;
        }
        // Like push(), shift() follows the read -> calculate -> mutate pattern for
        // exception safety.
        shift() {
          const oldFront = this._front;
          let newFront = oldFront;
          const oldCursor = this._cursor;
          let newCursor = oldCursor + 1;
          const elements = oldFront._elements;
          const element = elements[oldCursor];
          if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
            newFront = oldFront._next;
            newCursor = 0;
          }
          --this._size;
          this._cursor = newCursor;
          if (oldFront !== newFront) {
            this._front = newFront;
          }
          elements[oldCursor] = void 0;
          return element;
        }
        // The tricky thing about forEach() is that it can be called
        // re-entrantly. The queue may be mutated inside the callback. It is easy to
        // see that push() within the callback has no negative effects since the end
        // of the queue is checked for on every iteration. If shift() is called
        // repeatedly within the callback then the next iteration may return an
        // element that has been removed. In this case the callback will be called
        // with undefined values until we either "catch up" with elements that still
        // exist or reach the back of the queue.
        forEach(callback) {
          let i2 = this._cursor;
          let node = this._front;
          let elements = node._elements;
          while (i2 !== elements.length || node._next !== void 0) {
            if (i2 === elements.length) {
              node = node._next;
              elements = node._elements;
              i2 = 0;
              if (elements.length === 0) {
                break;
              }
            }
            callback(elements[i2]);
            ++i2;
          }
        }
        // Return the element that would be returned if shift() was called now,
        // without modifying the queue.
        peek() {
          const front = this._front;
          const cursor = this._cursor;
          return front._elements[cursor];
        }
      }
      const AbortSteps = Symbol("[[AbortSteps]]");
      const ErrorSteps = Symbol("[[ErrorSteps]]");
      const CancelSteps = Symbol("[[CancelSteps]]");
      const PullSteps = Symbol("[[PullSteps]]");
      const ReleaseSteps = Symbol("[[ReleaseSteps]]");
      function ReadableStreamReaderGenericInitialize(reader, stream) {
        reader._ownerReadableStream = stream;
        stream._reader = reader;
        if (stream._state === "readable") {
          defaultReaderClosedPromiseInitialize(reader);
        } else if (stream._state === "closed") {
          defaultReaderClosedPromiseInitializeAsResolved(reader);
        } else {
          defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
        }
      }
      function ReadableStreamReaderGenericCancel(reader, reason) {
        const stream = reader._ownerReadableStream;
        return ReadableStreamCancel(stream, reason);
      }
      function ReadableStreamReaderGenericRelease(reader) {
        const stream = reader._ownerReadableStream;
        if (stream._state === "readable") {
          defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        } else {
          defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        }
        stream._readableStreamController[ReleaseSteps]();
        stream._reader = void 0;
        reader._ownerReadableStream = void 0;
      }
      function readerLockException(name) {
        return new TypeError("Cannot " + name + " a stream using a released reader");
      }
      function defaultReaderClosedPromiseInitialize(reader) {
        reader._closedPromise = newPromise((resolve, reject) => {
          reader._closedPromise_resolve = resolve;
          reader._closedPromise_reject = reject;
        });
      }
      function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseReject(reader, reason);
      }
      function defaultReaderClosedPromiseInitializeAsResolved(reader) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseResolve(reader);
      }
      function defaultReaderClosedPromiseReject(reader, reason) {
        if (reader._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(reader._closedPromise);
        reader._closedPromise_reject(reason);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      function defaultReaderClosedPromiseResetToRejected(reader, reason) {
        defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
      }
      function defaultReaderClosedPromiseResolve(reader) {
        if (reader._closedPromise_resolve === void 0) {
          return;
        }
        reader._closedPromise_resolve(void 0);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      const NumberIsFinite = Number.isFinite || function(x2) {
        return typeof x2 === "number" && isFinite(x2);
      };
      const MathTrunc = Math.trunc || function(v) {
        return v < 0 ? Math.ceil(v) : Math.floor(v);
      };
      function isDictionary(x2) {
        return typeof x2 === "object" || typeof x2 === "function";
      }
      function assertDictionary(obj, context) {
        if (obj !== void 0 && !isDictionary(obj)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertFunction(x2, context) {
        if (typeof x2 !== "function") {
          throw new TypeError(`${context} is not a function.`);
        }
      }
      function isObject(x2) {
        return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
      }
      function assertObject(x2, context) {
        if (!isObject(x2)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertRequiredArgument(x2, position, context) {
        if (x2 === void 0) {
          throw new TypeError(`Parameter ${position} is required in '${context}'.`);
        }
      }
      function assertRequiredField(x2, field, context) {
        if (x2 === void 0) {
          throw new TypeError(`${field} is required in '${context}'.`);
        }
      }
      function convertUnrestrictedDouble(value) {
        return Number(value);
      }
      function censorNegativeZero(x2) {
        return x2 === 0 ? 0 : x2;
      }
      function integerPart(x2) {
        return censorNegativeZero(MathTrunc(x2));
      }
      function convertUnsignedLongLongWithEnforceRange(value, context) {
        const lowerBound = 0;
        const upperBound = Number.MAX_SAFE_INTEGER;
        let x2 = Number(value);
        x2 = censorNegativeZero(x2);
        if (!NumberIsFinite(x2)) {
          throw new TypeError(`${context} is not a finite number`);
        }
        x2 = integerPart(x2);
        if (x2 < lowerBound || x2 > upperBound) {
          throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
        }
        if (!NumberIsFinite(x2) || x2 === 0) {
          return 0;
        }
        return x2;
      }
      function assertReadableStream(x2, context) {
        if (!IsReadableStream(x2)) {
          throw new TypeError(`${context} is not a ReadableStream.`);
        }
      }
      function AcquireReadableStreamDefaultReader(stream) {
        return new ReadableStreamDefaultReader(stream);
      }
      function ReadableStreamAddReadRequest(stream, readRequest) {
        stream._reader._readRequests.push(readRequest);
      }
      function ReadableStreamFulfillReadRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readRequest = reader._readRequests.shift();
        if (done) {
          readRequest._closeSteps();
        } else {
          readRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadRequests(stream) {
        return stream._reader._readRequests.length;
      }
      function ReadableStreamHasDefaultReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamDefaultReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamDefaultReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readRequests = new SimpleQueue();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed,
         * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(reason = void 0) {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        /**
         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        read() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("read"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: () => resolvePromise({ value: void 0, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamDefaultReaderRead(this, readRequest);
          return promise;
        }
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        releaseLock() {
          if (!IsReadableStreamDefaultReader(this)) {
            throw defaultReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          ReadableStreamDefaultReaderRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamDefaultReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      setFunctionName(ReadableStreamDefaultReader.prototype.cancel, "cancel");
      setFunctionName(ReadableStreamDefaultReader.prototype.read, "read");
      setFunctionName(ReadableStreamDefaultReader.prototype.releaseLock, "releaseLock");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultReader.prototype, Symbol.toStringTag, {
          value: "ReadableStreamDefaultReader",
          configurable: true
        });
      }
      function IsReadableStreamDefaultReader(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
          return false;
        }
        return x2 instanceof ReadableStreamDefaultReader;
      }
      function ReadableStreamDefaultReaderRead(reader, readRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "closed") {
          readRequest._closeSteps();
        } else if (stream._state === "errored") {
          readRequest._errorSteps(stream._storedError);
        } else {
          stream._readableStreamController[PullSteps](readRequest);
        }
      }
      function ReadableStreamDefaultReaderRelease(reader) {
        ReadableStreamReaderGenericRelease(reader);
        const e2 = new TypeError("Reader was released");
        ReadableStreamDefaultReaderErrorReadRequests(reader, e2);
      }
      function ReadableStreamDefaultReaderErrorReadRequests(reader, e2) {
        const readRequests = reader._readRequests;
        reader._readRequests = new SimpleQueue();
        readRequests.forEach((readRequest) => {
          readRequest._errorSteps(e2);
        });
      }
      function defaultReaderBrandCheckException(name) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
      }
      const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class ReadableStreamAsyncIteratorImpl {
        constructor(reader, preventCancel) {
          this._ongoingPromise = void 0;
          this._isFinished = false;
          this._reader = reader;
          this._preventCancel = preventCancel;
        }
        next() {
          const nextSteps = () => this._nextSteps();
          this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
          return this._ongoingPromise;
        }
        return(value) {
          const returnSteps = () => this._returnSteps(value);
          return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
        }
        _nextSteps() {
          if (this._isFinished) {
            return Promise.resolve({ value: void 0, done: true });
          }
          const reader = this._reader;
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => {
              this._ongoingPromise = void 0;
              _queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              resolvePromise({ value: void 0, done: true });
            },
            _errorSteps: (reason) => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              rejectPromise(reason);
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promise;
        }
        _returnSteps(value) {
          if (this._isFinished) {
            return Promise.resolve({ value, done: true });
          }
          this._isFinished = true;
          const reader = this._reader;
          if (!this._preventCancel) {
            const result = ReadableStreamReaderGenericCancel(reader, value);
            ReadableStreamReaderGenericRelease(reader);
            return transformPromiseWith(result, () => ({ value, done: true }));
          }
          ReadableStreamReaderGenericRelease(reader);
          return promiseResolvedWith({ value, done: true });
        }
      }
      const ReadableStreamAsyncIteratorPrototype = {
        next() {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
          }
          return this._asyncIteratorImpl.next();
        },
        return(value) {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
          }
          return this._asyncIteratorImpl.return(value);
        }
      };
      Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
      function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
        const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
        iterator._asyncIteratorImpl = impl;
        return iterator;
      }
      function IsReadableStreamAsyncIterator(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
          return false;
        }
        try {
          return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
        } catch (_a2) {
          return false;
        }
      }
      function streamAsyncIteratorBrandCheckException(name) {
        return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
      }
      const NumberIsNaN = Number.isNaN || function(x2) {
        return x2 !== x2;
      };
      var _a, _b, _c;
      function CreateArrayFromList(elements) {
        return elements.slice();
      }
      function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
        new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
      }
      let TransferArrayBuffer = (O) => {
        if (typeof O.transfer === "function") {
          TransferArrayBuffer = (buffer) => buffer.transfer();
        } else if (typeof structuredClone === "function") {
          TransferArrayBuffer = (buffer) => structuredClone(buffer, { transfer: [buffer] });
        } else {
          TransferArrayBuffer = (buffer) => buffer;
        }
        return TransferArrayBuffer(O);
      };
      let IsDetachedBuffer = (O) => {
        if (typeof O.detached === "boolean") {
          IsDetachedBuffer = (buffer) => buffer.detached;
        } else {
          IsDetachedBuffer = (buffer) => buffer.byteLength === 0;
        }
        return IsDetachedBuffer(O);
      };
      function ArrayBufferSlice(buffer, begin, end) {
        if (buffer.slice) {
          return buffer.slice(begin, end);
        }
        const length = end - begin;
        const slice = new ArrayBuffer(length);
        CopyDataBlockBytes(slice, 0, buffer, begin, length);
        return slice;
      }
      function GetMethod(receiver, prop) {
        const func = receiver[prop];
        if (func === void 0 || func === null) {
          return void 0;
        }
        if (typeof func !== "function") {
          throw new TypeError(`${String(prop)} is not a function`);
        }
        return func;
      }
      function CreateAsyncFromSyncIterator(syncIteratorRecord) {
        const syncIterable = {
          [Symbol.iterator]: () => syncIteratorRecord.iterator
        };
        const asyncIterator = async function* () {
          return yield* syncIterable;
        }();
        const nextMethod = asyncIterator.next;
        return { iterator: asyncIterator, nextMethod, done: false };
      }
      const SymbolAsyncIterator = (_c = (_a = Symbol.asyncIterator) !== null && _a !== void 0 ? _a : (_b = Symbol.for) === null || _b === void 0 ? void 0 : _b.call(Symbol, "Symbol.asyncIterator")) !== null && _c !== void 0 ? _c : "@@asyncIterator";
      function GetIterator(obj, hint = "sync", method) {
        if (method === void 0) {
          if (hint === "async") {
            method = GetMethod(obj, SymbolAsyncIterator);
            if (method === void 0) {
              const syncMethod = GetMethod(obj, Symbol.iterator);
              const syncIteratorRecord = GetIterator(obj, "sync", syncMethod);
              return CreateAsyncFromSyncIterator(syncIteratorRecord);
            }
          } else {
            method = GetMethod(obj, Symbol.iterator);
          }
        }
        if (method === void 0) {
          throw new TypeError("The object is not iterable");
        }
        const iterator = reflectCall(method, obj, []);
        if (!typeIsObject(iterator)) {
          throw new TypeError("The iterator method must return an object");
        }
        const nextMethod = iterator.next;
        return { iterator, nextMethod, done: false };
      }
      function IteratorNext(iteratorRecord) {
        const result = reflectCall(iteratorRecord.nextMethod, iteratorRecord.iterator, []);
        if (!typeIsObject(result)) {
          throw new TypeError("The iterator.next() method must return an object");
        }
        return result;
      }
      function IteratorComplete(iterResult) {
        return Boolean(iterResult.done);
      }
      function IteratorValue(iterResult) {
        return iterResult.value;
      }
      function IsNonNegativeNumber(v) {
        if (typeof v !== "number") {
          return false;
        }
        if (NumberIsNaN(v)) {
          return false;
        }
        if (v < 0) {
          return false;
        }
        return true;
      }
      function CloneAsUint8Array(O) {
        const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
        return new Uint8Array(buffer);
      }
      function DequeueValue(container) {
        const pair = container._queue.shift();
        container._queueTotalSize -= pair.size;
        if (container._queueTotalSize < 0) {
          container._queueTotalSize = 0;
        }
        return pair.value;
      }
      function EnqueueValueWithSize(container, value, size) {
        if (!IsNonNegativeNumber(size) || size === Infinity) {
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        }
        container._queue.push({ value, size });
        container._queueTotalSize += size;
      }
      function PeekQueueValue(container) {
        const pair = container._queue.peek();
        return pair.value;
      }
      function ResetQueue(container) {
        container._queue = new SimpleQueue();
        container._queueTotalSize = 0;
      }
      function isDataViewConstructor(ctor) {
        return ctor === DataView;
      }
      function isDataView(view) {
        return isDataViewConstructor(view.constructor);
      }
      function arrayBufferViewElementSize(ctor) {
        if (isDataViewConstructor(ctor)) {
          return 1;
        }
        return ctor.BYTES_PER_ELEMENT;
      }
      class ReadableStreamBYOBRequest {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
         */
        get view() {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("view");
          }
          return this._view;
        }
        respond(bytesWritten) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respond");
          }
          assertRequiredArgument(bytesWritten, 1, "respond");
          bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(this._view.buffer)) {
            throw new TypeError(`The BYOB request's buffer has been detached and so cannot be used as a response`);
          }
          ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
        }
        respondWithNewView(view) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respondWithNewView");
          }
          assertRequiredArgument(view, 1, "respondWithNewView");
          if (!ArrayBuffer.isView(view)) {
            throw new TypeError("You can only respond with array buffer views");
          }
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(view.buffer)) {
            throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          }
          ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
        }
      }
      Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
        respond: { enumerable: true },
        respondWithNewView: { enumerable: true },
        view: { enumerable: true }
      });
      setFunctionName(ReadableStreamBYOBRequest.prototype.respond, "respond");
      setFunctionName(ReadableStreamBYOBRequest.prototype.respondWithNewView, "respondWithNewView");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBRequest.prototype, Symbol.toStringTag, {
          value: "ReadableStreamBYOBRequest",
          configurable: true
        });
      }
      class ReadableByteStreamController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the current BYOB pull request, or `null` if there isn't one.
         */
        get byobRequest() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("byobRequest");
          }
          return ReadableByteStreamControllerGetBYOBRequest(this);
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("desiredSize");
          }
          return ReadableByteStreamControllerGetDesiredSize(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("close");
          }
          if (this._closeRequested) {
            throw new TypeError("The stream has already been closed; do not close it again!");
          }
          const state = this._controlledReadableByteStream._state;
          if (state !== "readable") {
            throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
          }
          ReadableByteStreamControllerClose(this);
        }
        enqueue(chunk) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("enqueue");
          }
          assertRequiredArgument(chunk, 1, "enqueue");
          if (!ArrayBuffer.isView(chunk)) {
            throw new TypeError("chunk must be an array buffer view");
          }
          if (chunk.byteLength === 0) {
            throw new TypeError("chunk must have non-zero byteLength");
          }
          if (chunk.buffer.byteLength === 0) {
            throw new TypeError(`chunk's buffer must have non-zero byteLength`);
          }
          if (this._closeRequested) {
            throw new TypeError("stream is closed or draining");
          }
          const state = this._controlledReadableByteStream._state;
          if (state !== "readable") {
            throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
          }
          ReadableByteStreamControllerEnqueue(this, chunk);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(e2 = void 0) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("error");
          }
          ReadableByteStreamControllerError(this, e2);
        }
        /** @internal */
        [CancelSteps](reason) {
          ReadableByteStreamControllerClearPendingPullIntos(this);
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableByteStreamControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [PullSteps](readRequest) {
          const stream = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            ReadableByteStreamControllerFillReadRequestFromQueue(this, readRequest);
            return;
          }
          const autoAllocateChunkSize = this._autoAllocateChunkSize;
          if (autoAllocateChunkSize !== void 0) {
            let buffer;
            try {
              buffer = new ArrayBuffer(autoAllocateChunkSize);
            } catch (bufferE) {
              readRequest._errorSteps(bufferE);
              return;
            }
            const pullIntoDescriptor = {
              buffer,
              bufferByteLength: autoAllocateChunkSize,
              byteOffset: 0,
              byteLength: autoAllocateChunkSize,
              bytesFilled: 0,
              minimumFill: 1,
              elementSize: 1,
              viewConstructor: Uint8Array,
              readerType: "default"
            };
            this._pendingPullIntos.push(pullIntoDescriptor);
          }
          ReadableStreamAddReadRequest(stream, readRequest);
          ReadableByteStreamControllerCallPullIfNeeded(this);
        }
        /** @internal */
        [ReleaseSteps]() {
          if (this._pendingPullIntos.length > 0) {
            const firstPullInto = this._pendingPullIntos.peek();
            firstPullInto.readerType = "none";
            this._pendingPullIntos = new SimpleQueue();
            this._pendingPullIntos.push(firstPullInto);
          }
        }
      }
      Object.defineProperties(ReadableByteStreamController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        byobRequest: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(ReadableByteStreamController.prototype.close, "close");
      setFunctionName(ReadableByteStreamController.prototype.enqueue, "enqueue");
      setFunctionName(ReadableByteStreamController.prototype.error, "error");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableByteStreamController.prototype, Symbol.toStringTag, {
          value: "ReadableByteStreamController",
          configurable: true
        });
      }
      function IsReadableByteStreamController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
          return false;
        }
        return x2 instanceof ReadableByteStreamController;
      }
      function IsReadableStreamBYOBRequest(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
          return false;
        }
        return x2 instanceof ReadableStreamBYOBRequest;
      }
      function ReadableByteStreamControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
          return null;
        }, (e2) => {
          ReadableByteStreamControllerError(controller, e2);
          return null;
        });
      }
      function ReadableByteStreamControllerClearPendingPullIntos(controller) {
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        controller._pendingPullIntos = new SimpleQueue();
      }
      function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
        let done = false;
        if (stream._state === "closed") {
          done = true;
        }
        const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === "default") {
          ReadableStreamFulfillReadRequest(stream, filledView, done);
        } else {
          ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
        }
      }
      function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
        const bytesFilled = pullIntoDescriptor.bytesFilled;
        const elementSize = pullIntoDescriptor.elementSize;
        return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
      }
      function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
        controller._queue.push({ buffer, byteOffset, byteLength });
        controller._queueTotalSize += byteLength;
      }
      function ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, buffer, byteOffset, byteLength) {
        let clonedChunk;
        try {
          clonedChunk = ArrayBufferSlice(buffer, byteOffset, byteOffset + byteLength);
        } catch (cloneE) {
          ReadableByteStreamControllerError(controller, cloneE);
          throw cloneE;
        }
        ReadableByteStreamControllerEnqueueChunkToQueue(controller, clonedChunk, 0, byteLength);
      }
      function ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstDescriptor) {
        if (firstDescriptor.bytesFilled > 0) {
          ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, firstDescriptor.buffer, firstDescriptor.byteOffset, firstDescriptor.bytesFilled);
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
      }
      function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
        const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
        const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
        let totalBytesToCopyRemaining = maxBytesToCopy;
        let ready = false;
        const remainderBytes = maxBytesFilled % pullIntoDescriptor.elementSize;
        const maxAlignedBytes = maxBytesFilled - remainderBytes;
        if (maxAlignedBytes >= pullIntoDescriptor.minimumFill) {
          totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
          ready = true;
        }
        const queue = controller._queue;
        while (totalBytesToCopyRemaining > 0) {
          const headOfQueue = queue.peek();
          const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
          const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
          if (headOfQueue.byteLength === bytesToCopy) {
            queue.shift();
          } else {
            headOfQueue.byteOffset += bytesToCopy;
            headOfQueue.byteLength -= bytesToCopy;
          }
          controller._queueTotalSize -= bytesToCopy;
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
          totalBytesToCopyRemaining -= bytesToCopy;
        }
        return ready;
      }
      function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
        pullIntoDescriptor.bytesFilled += size;
      }
      function ReadableByteStreamControllerHandleQueueDrain(controller) {
        if (controller._queueTotalSize === 0 && controller._closeRequested) {
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(controller._controlledReadableByteStream);
        } else {
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
      }
      function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
        if (controller._byobRequest === null) {
          return;
        }
        controller._byobRequest._associatedReadableByteStreamController = void 0;
        controller._byobRequest._view = null;
        controller._byobRequest = null;
      }
      function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
        while (controller._pendingPullIntos.length > 0) {
          if (controller._queueTotalSize === 0) {
            return;
          }
          const pullIntoDescriptor = controller._pendingPullIntos.peek();
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerProcessReadRequestsUsingQueue(controller) {
        const reader = controller._controlledReadableByteStream._reader;
        while (reader._readRequests.length > 0) {
          if (controller._queueTotalSize === 0) {
            return;
          }
          const readRequest = reader._readRequests.shift();
          ReadableByteStreamControllerFillReadRequestFromQueue(controller, readRequest);
        }
      }
      function ReadableByteStreamControllerPullInto(controller, view, min, readIntoRequest) {
        const stream = controller._controlledReadableByteStream;
        const ctor = view.constructor;
        const elementSize = arrayBufferViewElementSize(ctor);
        const { byteOffset, byteLength } = view;
        const minimumFill = min * elementSize;
        let buffer;
        try {
          buffer = TransferArrayBuffer(view.buffer);
        } catch (e2) {
          readIntoRequest._errorSteps(e2);
          return;
        }
        const pullIntoDescriptor = {
          buffer,
          bufferByteLength: buffer.byteLength,
          byteOffset,
          byteLength,
          bytesFilled: 0,
          minimumFill,
          elementSize,
          viewConstructor: ctor,
          readerType: "byob"
        };
        if (controller._pendingPullIntos.length > 0) {
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          return;
        }
        if (stream._state === "closed") {
          const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
          readIntoRequest._closeSteps(emptyView);
          return;
        }
        if (controller._queueTotalSize > 0) {
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
            ReadableByteStreamControllerHandleQueueDrain(controller);
            readIntoRequest._chunkSteps(filledView);
            return;
          }
          if (controller._closeRequested) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            readIntoRequest._errorSteps(e2);
            return;
          }
        }
        controller._pendingPullIntos.push(pullIntoDescriptor);
        ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
        if (firstDescriptor.readerType === "none") {
          ReadableByteStreamControllerShiftPendingPullInto(controller);
        }
        const stream = controller._controlledReadableByteStream;
        if (ReadableStreamHasBYOBReader(stream)) {
          while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
        ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === "none") {
          ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          return;
        }
        if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.minimumFill) {
          return;
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
        const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
        if (remainderSize > 0) {
          const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          ReadableByteStreamControllerEnqueueClonedChunkToQueue(controller, pullIntoDescriptor.buffer, end - remainderSize, remainderSize);
        }
        pullIntoDescriptor.bytesFilled -= remainderSize;
        ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
        ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
      }
      function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor);
        } else {
          ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerShiftPendingPullInto(controller) {
        const descriptor = controller._pendingPullIntos.shift();
        return descriptor;
      }
      function ReadableByteStreamControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return false;
        }
        if (controller._closeRequested) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableByteStreamControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
      }
      function ReadableByteStreamControllerClose(controller) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        if (controller._queueTotalSize > 0) {
          controller._closeRequested = true;
          return;
        }
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (firstPendingPullInto.bytesFilled % firstPendingPullInto.elementSize !== 0) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            throw e2;
          }
        }
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamClose(stream);
      }
      function ReadableByteStreamControllerEnqueue(controller, chunk) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        const { buffer, byteOffset, byteLength } = chunk;
        if (IsDetachedBuffer(buffer)) {
          throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        }
        const transferredBuffer = TransferArrayBuffer(buffer);
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (IsDetachedBuffer(firstPendingPullInto.buffer)) {
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          if (firstPendingPullInto.readerType === "none") {
            ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue(controller, firstPendingPullInto);
          }
        }
        if (ReadableStreamHasDefaultReader(stream)) {
          ReadableByteStreamControllerProcessReadRequestsUsingQueue(controller);
          if (ReadableStreamGetNumReadRequests(stream) === 0) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          } else {
            if (controller._pendingPullIntos.length > 0) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
            }
            const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
            ReadableStreamFulfillReadRequest(stream, transferredView, false);
          }
        } else if (ReadableStreamHasBYOBReader(stream)) {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        } else {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerError(controller, e2) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return;
        }
        ReadableByteStreamControllerClearPendingPullIntos(controller);
        ResetQueue(controller);
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableByteStreamControllerFillReadRequestFromQueue(controller, readRequest) {
        const entry = controller._queue.shift();
        controller._queueTotalSize -= entry.byteLength;
        ReadableByteStreamControllerHandleQueueDrain(controller);
        const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
        readRequest._chunkSteps(view);
      }
      function ReadableByteStreamControllerGetBYOBRequest(controller) {
        if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
          const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
          SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
          controller._byobRequest = byobRequest;
        }
        return controller._byobRequest;
      }
      function ReadableByteStreamControllerGetDesiredSize(controller) {
        const state = controller._controlledReadableByteStream._state;
        if (state === "errored") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableByteStreamControllerRespond(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          if (bytesWritten !== 0) {
            throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
          }
        } else {
          if (bytesWritten === 0) {
            throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          }
          if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
            throw new RangeError("bytesWritten out of range");
          }
        }
        firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
        ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
      }
      function ReadableByteStreamControllerRespondWithNewView(controller, view) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state = controller._controlledReadableByteStream._state;
        if (state === "closed") {
          if (view.byteLength !== 0) {
            throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
          }
        } else {
          if (view.byteLength === 0) {
            throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
          }
        }
        if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
          throw new RangeError("The region specified by view does not match byobRequest");
        }
        if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
          throw new RangeError("The buffer of view has different capacity than byobRequest");
        }
        if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
          throw new RangeError("The region specified by view is larger than byobRequest");
        }
        const viewByteLength = view.byteLength;
        firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
        ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
      }
      function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
        controller._controlledReadableByteStream = stream;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._byobRequest = null;
        controller._queue = controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._closeRequested = false;
        controller._started = false;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._autoAllocateChunkSize = autoAllocateChunkSize;
        controller._pendingPullIntos = new SimpleQueue();
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableByteStreamControllerCallPullIfNeeded(controller);
          return null;
        }, (r2) => {
          ReadableByteStreamControllerError(controller, r2);
          return null;
        });
      }
      function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
        const controller = Object.create(ReadableByteStreamController.prototype);
        let startAlgorithm;
        let pullAlgorithm;
        let cancelAlgorithm;
        if (underlyingByteSource.start !== void 0) {
          startAlgorithm = () => underlyingByteSource.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingByteSource.pull !== void 0) {
          pullAlgorithm = () => underlyingByteSource.pull(controller);
        } else {
          pullAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingByteSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
        if (autoAllocateChunkSize === 0) {
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        }
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
      }
      function SetUpReadableStreamBYOBRequest(request, controller, view) {
        request._associatedReadableByteStreamController = controller;
        request._view = view;
      }
      function byobRequestBrandCheckException(name) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
      }
      function byteStreamControllerBrandCheckException(name) {
        return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
      }
      function convertReaderOptions(options, context) {
        assertDictionary(options, context);
        const mode = options === null || options === void 0 ? void 0 : options.mode;
        return {
          mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
        };
      }
      function convertReadableStreamReaderMode(mode, context) {
        mode = `${mode}`;
        if (mode !== "byob") {
          throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
        }
        return mode;
      }
      function convertByobReadOptions(options, context) {
        var _a2;
        assertDictionary(options, context);
        const min = (_a2 = options === null || options === void 0 ? void 0 : options.min) !== null && _a2 !== void 0 ? _a2 : 1;
        return {
          min: convertUnsignedLongLongWithEnforceRange(min, `${context} has member 'min' that`)
        };
      }
      function AcquireReadableStreamBYOBReader(stream) {
        return new ReadableStreamBYOBReader(stream);
      }
      function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
        stream._reader._readIntoRequests.push(readIntoRequest);
      }
      function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readIntoRequest = reader._readIntoRequests.shift();
        if (done) {
          readIntoRequest._closeSteps(chunk);
        } else {
          readIntoRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadIntoRequests(stream) {
        return stream._reader._readIntoRequests.length;
      }
      function ReadableStreamHasBYOBReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamBYOBReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamBYOBReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          if (!IsReadableByteStreamController(stream._readableStreamController)) {
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readIntoRequests = new SimpleQueue();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(reason = void 0) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        read(view, rawOptions = {}) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("read"));
          }
          if (!ArrayBuffer.isView(view)) {
            return promiseRejectedWith(new TypeError("view must be an array buffer view"));
          }
          if (view.byteLength === 0) {
            return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
          }
          if (view.buffer.byteLength === 0) {
            return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
          }
          if (IsDetachedBuffer(view.buffer)) {
            return promiseRejectedWith(new TypeError("view's buffer has been detached"));
          }
          let options;
          try {
            options = convertByobReadOptions(rawOptions, "options");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const min = options.min;
          if (min === 0) {
            return promiseRejectedWith(new TypeError("options.min must be greater than 0"));
          }
          if (!isDataView(view)) {
            if (min > view.length) {
              return promiseRejectedWith(new RangeError("options.min must be less than or equal to view's length"));
            }
          } else if (min > view.byteLength) {
            return promiseRejectedWith(new RangeError("options.min must be less than or equal to view's byteLength"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise = newPromise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
          });
          const readIntoRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamBYOBReaderRead(this, view, min, readIntoRequest);
          return promise;
        }
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        releaseLock() {
          if (!IsReadableStreamBYOBReader(this)) {
            throw byobReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          ReadableStreamBYOBReaderRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamBYOBReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      setFunctionName(ReadableStreamBYOBReader.prototype.cancel, "cancel");
      setFunctionName(ReadableStreamBYOBReader.prototype.read, "read");
      setFunctionName(ReadableStreamBYOBReader.prototype.releaseLock, "releaseLock");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBReader.prototype, Symbol.toStringTag, {
          value: "ReadableStreamBYOBReader",
          configurable: true
        });
      }
      function IsReadableStreamBYOBReader(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
          return false;
        }
        return x2 instanceof ReadableStreamBYOBReader;
      }
      function ReadableStreamBYOBReaderRead(reader, view, min, readIntoRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "errored") {
          readIntoRequest._errorSteps(stream._storedError);
        } else {
          ReadableByteStreamControllerPullInto(stream._readableStreamController, view, min, readIntoRequest);
        }
      }
      function ReadableStreamBYOBReaderRelease(reader) {
        ReadableStreamReaderGenericRelease(reader);
        const e2 = new TypeError("Reader was released");
        ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2);
      }
      function ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2) {
        const readIntoRequests = reader._readIntoRequests;
        reader._readIntoRequests = new SimpleQueue();
        readIntoRequests.forEach((readIntoRequest) => {
          readIntoRequest._errorSteps(e2);
        });
      }
      function byobReaderBrandCheckException(name) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
      }
      function ExtractHighWaterMark(strategy, defaultHWM) {
        const { highWaterMark } = strategy;
        if (highWaterMark === void 0) {
          return defaultHWM;
        }
        if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
          throw new RangeError("Invalid highWaterMark");
        }
        return highWaterMark;
      }
      function ExtractSizeAlgorithm(strategy) {
        const { size } = strategy;
        if (!size) {
          return () => 1;
        }
        return size;
      }
      function convertQueuingStrategy(init2, context) {
        assertDictionary(init2, context);
        const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
        const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
        return {
          highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
          size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
        };
      }
      function convertQueuingStrategySize(fn, context) {
        assertFunction(fn, context);
        return (chunk) => convertUnrestrictedDouble(fn(chunk));
      }
      function convertUnderlyingSink(original, context) {
        assertDictionary(original, context);
        const abort = original === null || original === void 0 ? void 0 : original.abort;
        const close = original === null || original === void 0 ? void 0 : original.close;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        const write = original === null || original === void 0 ? void 0 : original.write;
        return {
          abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
          close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
          write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
          type
        };
      }
      function convertUnderlyingSinkAbortCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      function convertUnderlyingSinkCloseCallback(fn, original, context) {
        assertFunction(fn, context);
        return () => promiseCall(fn, original, []);
      }
      function convertUnderlyingSinkStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertUnderlyingSinkWriteCallback(fn, original, context) {
        assertFunction(fn, context);
        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
      }
      function assertWritableStream(x2, context) {
        if (!IsWritableStream(x2)) {
          throw new TypeError(`${context} is not a WritableStream.`);
        }
      }
      function isAbortSignal2(value) {
        if (typeof value !== "object" || value === null) {
          return false;
        }
        try {
          return typeof value.aborted === "boolean";
        } catch (_a2) {
          return false;
        }
      }
      const supportsAbortController = typeof AbortController === "function";
      function createAbortController() {
        if (supportsAbortController) {
          return new AbortController();
        }
        return void 0;
      }
      class WritableStream {
        constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
          if (rawUnderlyingSink === void 0) {
            rawUnderlyingSink = null;
          } else {
            assertObject(rawUnderlyingSink, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
          InitializeWritableStream(this);
          const type = underlyingSink.type;
          if (type !== void 0) {
            throw new RangeError("Invalid type is specified");
          }
          const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
          const highWaterMark = ExtractHighWaterMark(strategy, 1);
          SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
        }
        /**
         * Returns whether or not the writable stream is locked to a writer.
         */
        get locked() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("locked");
          }
          return IsWritableStreamLocked(this);
        }
        /**
         * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
         * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
         * mechanism of the underlying sink.
         *
         * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
         * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
         * the stream) if the stream is currently locked.
         */
        abort(reason = void 0) {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("abort"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
          }
          return WritableStreamAbort(this, reason);
        }
        /**
         * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
         * close behavior. During this time any further attempts to write will fail (without erroring the stream).
         *
         * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
         * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
         * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
         */
        close() {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("close"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
          }
          if (WritableStreamCloseQueuedOrInFlight(this)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamClose(this);
        }
        /**
         * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
         * is locked, no other writer can be acquired until this one is released.
         *
         * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
         * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
         * the same time, which would cause the resulting written data to be unpredictable and probably useless.
         */
        getWriter() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("getWriter");
          }
          return AcquireWritableStreamDefaultWriter(this);
        }
      }
      Object.defineProperties(WritableStream.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        getWriter: { enumerable: true },
        locked: { enumerable: true }
      });
      setFunctionName(WritableStream.prototype.abort, "abort");
      setFunctionName(WritableStream.prototype.close, "close");
      setFunctionName(WritableStream.prototype.getWriter, "getWriter");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStream.prototype, Symbol.toStringTag, {
          value: "WritableStream",
          configurable: true
        });
      }
      function AcquireWritableStreamDefaultWriter(stream) {
        return new WritableStreamDefaultWriter(stream);
      }
      function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(WritableStream.prototype);
        InitializeWritableStream(stream);
        const controller = Object.create(WritableStreamDefaultController.prototype);
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function InitializeWritableStream(stream) {
        stream._state = "writable";
        stream._storedError = void 0;
        stream._writer = void 0;
        stream._writableStreamController = void 0;
        stream._writeRequests = new SimpleQueue();
        stream._inFlightWriteRequest = void 0;
        stream._closeRequest = void 0;
        stream._inFlightCloseRequest = void 0;
        stream._pendingAbortRequest = void 0;
        stream._backpressure = false;
      }
      function IsWritableStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
          return false;
        }
        return x2 instanceof WritableStream;
      }
      function IsWritableStreamLocked(stream) {
        if (stream._writer === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamAbort(stream, reason) {
        var _a2;
        if (stream._state === "closed" || stream._state === "errored") {
          return promiseResolvedWith(void 0);
        }
        stream._writableStreamController._abortReason = reason;
        (_a2 = stream._writableStreamController._abortController) === null || _a2 === void 0 ? void 0 : _a2.abort(reason);
        const state = stream._state;
        if (state === "closed" || state === "errored") {
          return promiseResolvedWith(void 0);
        }
        if (stream._pendingAbortRequest !== void 0) {
          return stream._pendingAbortRequest._promise;
        }
        let wasAlreadyErroring = false;
        if (state === "erroring") {
          wasAlreadyErroring = true;
          reason = void 0;
        }
        const promise = newPromise((resolve, reject) => {
          stream._pendingAbortRequest = {
            _promise: void 0,
            _resolve: resolve,
            _reject: reject,
            _reason: reason,
            _wasAlreadyErroring: wasAlreadyErroring
          };
        });
        stream._pendingAbortRequest._promise = promise;
        if (!wasAlreadyErroring) {
          WritableStreamStartErroring(stream, reason);
        }
        return promise;
      }
      function WritableStreamClose(stream) {
        const state = stream._state;
        if (state === "closed" || state === "errored") {
          return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
        }
        const promise = newPromise((resolve, reject) => {
          const closeRequest = {
            _resolve: resolve,
            _reject: reject
          };
          stream._closeRequest = closeRequest;
        });
        const writer = stream._writer;
        if (writer !== void 0 && stream._backpressure && state === "writable") {
          defaultWriterReadyPromiseResolve(writer);
        }
        WritableStreamDefaultControllerClose(stream._writableStreamController);
        return promise;
      }
      function WritableStreamAddWriteRequest(stream) {
        const promise = newPromise((resolve, reject) => {
          const writeRequest = {
            _resolve: resolve,
            _reject: reject
          };
          stream._writeRequests.push(writeRequest);
        });
        return promise;
      }
      function WritableStreamDealWithRejection(stream, error) {
        const state = stream._state;
        if (state === "writable") {
          WritableStreamStartErroring(stream, error);
          return;
        }
        WritableStreamFinishErroring(stream);
      }
      function WritableStreamStartErroring(stream, reason) {
        const controller = stream._writableStreamController;
        stream._state = "erroring";
        stream._storedError = reason;
        const writer = stream._writer;
        if (writer !== void 0) {
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
        }
        if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
          WritableStreamFinishErroring(stream);
        }
      }
      function WritableStreamFinishErroring(stream) {
        stream._state = "errored";
        stream._writableStreamController[ErrorSteps]();
        const storedError = stream._storedError;
        stream._writeRequests.forEach((writeRequest) => {
          writeRequest._reject(storedError);
        });
        stream._writeRequests = new SimpleQueue();
        if (stream._pendingAbortRequest === void 0) {
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const abortRequest = stream._pendingAbortRequest;
        stream._pendingAbortRequest = void 0;
        if (abortRequest._wasAlreadyErroring) {
          abortRequest._reject(storedError);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
        uponPromise(promise, () => {
          abortRequest._resolve();
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return null;
        }, (reason) => {
          abortRequest._reject(reason);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return null;
        });
      }
      function WritableStreamFinishInFlightWrite(stream) {
        stream._inFlightWriteRequest._resolve(void 0);
        stream._inFlightWriteRequest = void 0;
      }
      function WritableStreamFinishInFlightWriteWithError(stream, error) {
        stream._inFlightWriteRequest._reject(error);
        stream._inFlightWriteRequest = void 0;
        WritableStreamDealWithRejection(stream, error);
      }
      function WritableStreamFinishInFlightClose(stream) {
        stream._inFlightCloseRequest._resolve(void 0);
        stream._inFlightCloseRequest = void 0;
        const state = stream._state;
        if (state === "erroring") {
          stream._storedError = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._resolve();
            stream._pendingAbortRequest = void 0;
          }
        }
        stream._state = "closed";
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseResolve(writer);
        }
      }
      function WritableStreamFinishInFlightCloseWithError(stream, error) {
        stream._inFlightCloseRequest._reject(error);
        stream._inFlightCloseRequest = void 0;
        if (stream._pendingAbortRequest !== void 0) {
          stream._pendingAbortRequest._reject(error);
          stream._pendingAbortRequest = void 0;
        }
        WritableStreamDealWithRejection(stream, error);
      }
      function WritableStreamCloseQueuedOrInFlight(stream) {
        if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamHasOperationMarkedInFlight(stream) {
        if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamMarkCloseRequestInFlight(stream) {
        stream._inFlightCloseRequest = stream._closeRequest;
        stream._closeRequest = void 0;
      }
      function WritableStreamMarkFirstWriteRequestInFlight(stream) {
        stream._inFlightWriteRequest = stream._writeRequests.shift();
      }
      function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
        if (stream._closeRequest !== void 0) {
          stream._closeRequest._reject(stream._storedError);
          stream._closeRequest = void 0;
        }
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseReject(writer, stream._storedError);
        }
      }
      function WritableStreamUpdateBackpressure(stream, backpressure) {
        const writer = stream._writer;
        if (writer !== void 0 && backpressure !== stream._backpressure) {
          if (backpressure) {
            defaultWriterReadyPromiseReset(writer);
          } else {
            defaultWriterReadyPromiseResolve(writer);
          }
        }
        stream._backpressure = backpressure;
      }
      class WritableStreamDefaultWriter {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
          assertWritableStream(stream, "First parameter");
          if (IsWritableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          }
          this._ownerWritableStream = stream;
          stream._writer = this;
          const state = stream._state;
          if (state === "writable") {
            if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
              defaultWriterReadyPromiseInitialize(this);
            } else {
              defaultWriterReadyPromiseInitializeAsResolved(this);
            }
            defaultWriterClosedPromiseInitialize(this);
          } else if (state === "erroring") {
            defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
            defaultWriterClosedPromiseInitialize(this);
          } else if (state === "closed") {
            defaultWriterReadyPromiseInitializeAsResolved(this);
            defaultWriterClosedPromiseInitializeAsResolved(this);
          } else {
            const storedError = stream._storedError;
            defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
            defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
          }
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the writer’s lock is released before the stream finishes closing.
         */
        get closed() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        /**
         * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
         * A producer can use this information to determine the right amount of data to write.
         *
         * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
         * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
         * the writer’s lock is released.
         */
        get desiredSize() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("desiredSize");
          }
          if (this._ownerWritableStream === void 0) {
            throw defaultWriterLockException("desiredSize");
          }
          return WritableStreamDefaultWriterGetDesiredSize(this);
        }
        /**
         * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
         * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
         * back to zero or below, the getter will return a new promise that stays pending until the next transition.
         *
         * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
         * rejected.
         */
        get ready() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
          }
          return this._readyPromise;
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
         */
        abort(reason = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("abort"));
          }
          return WritableStreamDefaultWriterAbort(this, reason);
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        close() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("close"));
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("close"));
          }
          if (WritableStreamCloseQueuedOrInFlight(stream)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamDefaultWriterClose(this);
        }
        /**
         * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
         * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
         * now on; otherwise, the writer will appear closed.
         *
         * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
         * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
         * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
         * other producers from writing in an interleaved manner.
         */
        releaseLock() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("releaseLock");
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return;
          }
          WritableStreamDefaultWriterRelease(this);
        }
        write(chunk = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("write"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          return WritableStreamDefaultWriterWrite(this, chunk);
        }
      }
      Object.defineProperties(WritableStreamDefaultWriter.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        releaseLock: { enumerable: true },
        write: { enumerable: true },
        closed: { enumerable: true },
        desiredSize: { enumerable: true },
        ready: { enumerable: true }
      });
      setFunctionName(WritableStreamDefaultWriter.prototype.abort, "abort");
      setFunctionName(WritableStreamDefaultWriter.prototype.close, "close");
      setFunctionName(WritableStreamDefaultWriter.prototype.releaseLock, "releaseLock");
      setFunctionName(WritableStreamDefaultWriter.prototype.write, "write");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultWriter.prototype, Symbol.toStringTag, {
          value: "WritableStreamDefaultWriter",
          configurable: true
        });
      }
      function IsWritableStreamDefaultWriter(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
          return false;
        }
        return x2 instanceof WritableStreamDefaultWriter;
      }
      function WritableStreamDefaultWriterAbort(writer, reason) {
        const stream = writer._ownerWritableStream;
        return WritableStreamAbort(stream, reason);
      }
      function WritableStreamDefaultWriterClose(writer) {
        const stream = writer._ownerWritableStream;
        return WritableStreamClose(stream);
      }
      function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
        const stream = writer._ownerWritableStream;
        const state = stream._state;
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        return WritableStreamDefaultWriterClose(writer);
      }
      function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
        if (writer._closedPromiseState === "pending") {
          defaultWriterClosedPromiseReject(writer, error);
        } else {
          defaultWriterClosedPromiseResetToRejected(writer, error);
        }
      }
      function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
        if (writer._readyPromiseState === "pending") {
          defaultWriterReadyPromiseReject(writer, error);
        } else {
          defaultWriterReadyPromiseResetToRejected(writer, error);
        }
      }
      function WritableStreamDefaultWriterGetDesiredSize(writer) {
        const stream = writer._ownerWritableStream;
        const state = stream._state;
        if (state === "errored" || state === "erroring") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
      }
      function WritableStreamDefaultWriterRelease(writer) {
        const stream = writer._ownerWritableStream;
        const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
        WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
        WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
        stream._writer = void 0;
        writer._ownerWritableStream = void 0;
      }
      function WritableStreamDefaultWriterWrite(writer, chunk) {
        const stream = writer._ownerWritableStream;
        const controller = stream._writableStreamController;
        const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
        if (stream !== writer._ownerWritableStream) {
          return promiseRejectedWith(defaultWriterLockException("write to"));
        }
        const state = stream._state;
        if (state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
          return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
        }
        if (state === "erroring") {
          return promiseRejectedWith(stream._storedError);
        }
        const promise = WritableStreamAddWriteRequest(stream);
        WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
        return promise;
      }
      const closeSentinel = {};
      class WritableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
         *
         * @deprecated
         *  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
         *  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
         */
        get abortReason() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("abortReason");
          }
          return this._abortReason;
        }
        /**
         * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
         */
        get signal() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("signal");
          }
          if (this._abortController === void 0) {
            throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
          }
          return this._abortController.signal;
        }
        /**
         * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
         *
         * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
         * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
         * normal lifecycle of interactions with the underlying sink.
         */
        error(e2 = void 0) {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("error");
          }
          const state = this._controlledWritableStream._state;
          if (state !== "writable") {
            return;
          }
          WritableStreamDefaultControllerError(this, e2);
        }
        /** @internal */
        [AbortSteps](reason) {
          const result = this._abortAlgorithm(reason);
          WritableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [ErrorSteps]() {
          ResetQueue(this);
        }
      }
      Object.defineProperties(WritableStreamDefaultController.prototype, {
        abortReason: { enumerable: true },
        signal: { enumerable: true },
        error: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "WritableStreamDefaultController",
          configurable: true
        });
      }
      function IsWritableStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
          return false;
        }
        return x2 instanceof WritableStreamDefaultController;
      }
      function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledWritableStream = stream;
        stream._writableStreamController = controller;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._abortReason = void 0;
        controller._abortController = createAbortController();
        controller._started = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._writeAlgorithm = writeAlgorithm;
        controller._closeAlgorithm = closeAlgorithm;
        controller._abortAlgorithm = abortAlgorithm;
        const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
        WritableStreamUpdateBackpressure(stream, backpressure);
        const startResult = startAlgorithm();
        const startPromise = promiseResolvedWith(startResult);
        uponPromise(startPromise, () => {
          controller._started = true;
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          return null;
        }, (r2) => {
          controller._started = true;
          WritableStreamDealWithRejection(stream, r2);
          return null;
        });
      }
      function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(WritableStreamDefaultController.prototype);
        let startAlgorithm;
        let writeAlgorithm;
        let closeAlgorithm;
        let abortAlgorithm;
        if (underlyingSink.start !== void 0) {
          startAlgorithm = () => underlyingSink.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingSink.write !== void 0) {
          writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
        } else {
          writeAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSink.close !== void 0) {
          closeAlgorithm = () => underlyingSink.close();
        } else {
          closeAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSink.abort !== void 0) {
          abortAlgorithm = (reason) => underlyingSink.abort(reason);
        } else {
          abortAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function WritableStreamDefaultControllerClearAlgorithms(controller) {
        controller._writeAlgorithm = void 0;
        controller._closeAlgorithm = void 0;
        controller._abortAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function WritableStreamDefaultControllerClose(controller) {
        EnqueueValueWithSize(controller, closeSentinel, 0);
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
        try {
          return controller._strategySizeAlgorithm(chunk);
        } catch (chunkSizeE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
          return 1;
        }
      }
      function WritableStreamDefaultControllerGetDesiredSize(controller) {
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
        try {
          EnqueueValueWithSize(controller, chunk, chunkSize);
        } catch (enqueueE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
          return;
        }
        const stream = controller._controlledWritableStream;
        if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
        }
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
        const stream = controller._controlledWritableStream;
        if (!controller._started) {
          return;
        }
        if (stream._inFlightWriteRequest !== void 0) {
          return;
        }
        const state = stream._state;
        if (state === "erroring") {
          WritableStreamFinishErroring(stream);
          return;
        }
        if (controller._queue.length === 0) {
          return;
        }
        const value = PeekQueueValue(controller);
        if (value === closeSentinel) {
          WritableStreamDefaultControllerProcessClose(controller);
        } else {
          WritableStreamDefaultControllerProcessWrite(controller, value);
        }
      }
      function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
        if (controller._controlledWritableStream._state === "writable") {
          WritableStreamDefaultControllerError(controller, error);
        }
      }
      function WritableStreamDefaultControllerProcessClose(controller) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkCloseRequestInFlight(stream);
        DequeueValue(controller);
        const sinkClosePromise = controller._closeAlgorithm();
        WritableStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(sinkClosePromise, () => {
          WritableStreamFinishInFlightClose(stream);
          return null;
        }, (reason) => {
          WritableStreamFinishInFlightCloseWithError(stream, reason);
          return null;
        });
      }
      function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkFirstWriteRequestInFlight(stream);
        const sinkWritePromise = controller._writeAlgorithm(chunk);
        uponPromise(sinkWritePromise, () => {
          WritableStreamFinishInFlightWrite(stream);
          const state = stream._state;
          DequeueValue(controller);
          if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          return null;
        }, (reason) => {
          if (stream._state === "writable") {
            WritableStreamDefaultControllerClearAlgorithms(controller);
          }
          WritableStreamFinishInFlightWriteWithError(stream, reason);
          return null;
        });
      }
      function WritableStreamDefaultControllerGetBackpressure(controller) {
        const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
        return desiredSize <= 0;
      }
      function WritableStreamDefaultControllerError(controller, error) {
        const stream = controller._controlledWritableStream;
        WritableStreamDefaultControllerClearAlgorithms(controller);
        WritableStreamStartErroring(stream, error);
      }
      function streamBrandCheckException$2(name) {
        return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
      }
      function defaultControllerBrandCheckException$2(name) {
        return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
      }
      function defaultWriterBrandCheckException(name) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
      }
      function defaultWriterLockException(name) {
        return new TypeError("Cannot " + name + " a stream using a released writer");
      }
      function defaultWriterClosedPromiseInitialize(writer) {
        writer._closedPromise = newPromise((resolve, reject) => {
          writer._closedPromise_resolve = resolve;
          writer._closedPromise_reject = reject;
          writer._closedPromiseState = "pending";
        });
      }
      function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseReject(writer, reason);
      }
      function defaultWriterClosedPromiseInitializeAsResolved(writer) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseResolve(writer);
      }
      function defaultWriterClosedPromiseReject(writer, reason) {
        if (writer._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._closedPromise);
        writer._closedPromise_reject(reason);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "rejected";
      }
      function defaultWriterClosedPromiseResetToRejected(writer, reason) {
        defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterClosedPromiseResolve(writer) {
        if (writer._closedPromise_resolve === void 0) {
          return;
        }
        writer._closedPromise_resolve(void 0);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "resolved";
      }
      function defaultWriterReadyPromiseInitialize(writer) {
        writer._readyPromise = newPromise((resolve, reject) => {
          writer._readyPromise_resolve = resolve;
          writer._readyPromise_reject = reject;
        });
        writer._readyPromiseState = "pending";
      }
      function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseReject(writer, reason);
      }
      function defaultWriterReadyPromiseInitializeAsResolved(writer) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseResolve(writer);
      }
      function defaultWriterReadyPromiseReject(writer, reason) {
        if (writer._readyPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._readyPromise);
        writer._readyPromise_reject(reason);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "rejected";
      }
      function defaultWriterReadyPromiseReset(writer) {
        defaultWriterReadyPromiseInitialize(writer);
      }
      function defaultWriterReadyPromiseResetToRejected(writer, reason) {
        defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterReadyPromiseResolve(writer) {
        if (writer._readyPromise_resolve === void 0) {
          return;
        }
        writer._readyPromise_resolve(void 0);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "fulfilled";
      }
      function getGlobals() {
        if (typeof globalThis !== "undefined") {
          return globalThis;
        } else if (typeof self !== "undefined") {
          return self;
        } else if (typeof global !== "undefined") {
          return global;
        }
        return void 0;
      }
      const globals = getGlobals();
      function isDOMExceptionConstructor(ctor) {
        if (!(typeof ctor === "function" || typeof ctor === "object")) {
          return false;
        }
        if (ctor.name !== "DOMException") {
          return false;
        }
        try {
          new ctor();
          return true;
        } catch (_a2) {
          return false;
        }
      }
      function getFromGlobal() {
        const ctor = globals === null || globals === void 0 ? void 0 : globals.DOMException;
        return isDOMExceptionConstructor(ctor) ? ctor : void 0;
      }
      function createPolyfill() {
        const ctor = function DOMException3(message, name) {
          this.message = message || "";
          this.name = name || "Error";
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
        };
        setFunctionName(ctor, "DOMException");
        ctor.prototype = Object.create(Error.prototype);
        Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
        return ctor;
      }
      const DOMException2 = getFromGlobal() || createPolyfill();
      function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
        const reader = AcquireReadableStreamDefaultReader(source);
        const writer = AcquireWritableStreamDefaultWriter(dest);
        source._disturbed = true;
        let shuttingDown = false;
        let currentWrite = promiseResolvedWith(void 0);
        return newPromise((resolve, reject) => {
          let abortAlgorithm;
          if (signal !== void 0) {
            abortAlgorithm = () => {
              const error = signal.reason !== void 0 ? signal.reason : new DOMException2("Aborted", "AbortError");
              const actions = [];
              if (!preventAbort) {
                actions.push(() => {
                  if (dest._state === "writable") {
                    return WritableStreamAbort(dest, error);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              if (!preventCancel) {
                actions.push(() => {
                  if (source._state === "readable") {
                    return ReadableStreamCancel(source, error);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
            };
            if (signal.aborted) {
              abortAlgorithm();
              return;
            }
            signal.addEventListener("abort", abortAlgorithm);
          }
          function pipeLoop() {
            return newPromise((resolveLoop, rejectLoop) => {
              function next(done) {
                if (done) {
                  resolveLoop();
                } else {
                  PerformPromiseThen(pipeStep(), next, rejectLoop);
                }
              }
              next(false);
            });
          }
          function pipeStep() {
            if (shuttingDown) {
              return promiseResolvedWith(true);
            }
            return PerformPromiseThen(writer._readyPromise, () => {
              return newPromise((resolveRead, rejectRead) => {
                ReadableStreamDefaultReaderRead(reader, {
                  _chunkSteps: (chunk) => {
                    currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop2);
                    resolveRead(false);
                  },
                  _closeSteps: () => resolveRead(true),
                  _errorSteps: rejectRead
                });
              });
            });
          }
          isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
            if (!preventAbort) {
              shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
            return null;
          });
          isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
            return null;
          });
          isOrBecomesClosed(source, reader._closedPromise, () => {
            if (!preventClose) {
              shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
            } else {
              shutdown();
            }
            return null;
          });
          if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
            const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
            } else {
              shutdown(true, destClosed);
            }
          }
          setPromiseIsHandledToTrue(pipeLoop());
          function waitForWritesToFinish() {
            const oldCurrentWrite = currentWrite;
            return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
          }
          function isOrBecomesErrored(stream, promise, action) {
            if (stream._state === "errored") {
              action(stream._storedError);
            } else {
              uponRejection(promise, action);
            }
          }
          function isOrBecomesClosed(stream, promise, action) {
            if (stream._state === "closed") {
              action();
            } else {
              uponFulfillment(promise, action);
            }
          }
          function shutdownWithAction(action, originalIsError, originalError) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), doTheRest);
            } else {
              doTheRest();
            }
            function doTheRest() {
              uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              return null;
            }
          }
          function shutdown(isError, error) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
            } else {
              finalize(isError, error);
            }
          }
          function finalize(isError, error) {
            WritableStreamDefaultWriterRelease(writer);
            ReadableStreamReaderGenericRelease(reader);
            if (signal !== void 0) {
              signal.removeEventListener("abort", abortAlgorithm);
            }
            if (isError) {
              reject(error);
            } else {
              resolve(void 0);
            }
            return null;
          }
        });
      }
      class ReadableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("desiredSize");
          }
          return ReadableStreamDefaultControllerGetDesiredSize(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("close");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits close");
          }
          ReadableStreamDefaultControllerClose(this);
        }
        enqueue(chunk = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("enqueue");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits enqueue");
          }
          return ReadableStreamDefaultControllerEnqueue(this, chunk);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(e2 = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("error");
          }
          ReadableStreamDefaultControllerError(this, e2);
        }
        /** @internal */
        [CancelSteps](reason) {
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        /** @internal */
        [PullSteps](readRequest) {
          const stream = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const chunk = DequeueValue(this);
            if (this._closeRequested && this._queue.length === 0) {
              ReadableStreamDefaultControllerClearAlgorithms(this);
              ReadableStreamClose(stream);
            } else {
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
            readRequest._chunkSteps(chunk);
          } else {
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableStreamDefaultControllerCallPullIfNeeded(this);
          }
        }
        /** @internal */
        [ReleaseSteps]() {
        }
      }
      Object.defineProperties(ReadableStreamDefaultController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(ReadableStreamDefaultController.prototype.close, "close");
      setFunctionName(ReadableStreamDefaultController.prototype.enqueue, "enqueue");
      setFunctionName(ReadableStreamDefaultController.prototype.error, "error");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "ReadableStreamDefaultController",
          configurable: true
        });
      }
      function IsReadableStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
          return false;
        }
        return x2 instanceof ReadableStreamDefaultController;
      }
      function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }
          return null;
        }, (e2) => {
          ReadableStreamDefaultControllerError(controller, e2);
          return null;
        });
      }
      function ReadableStreamDefaultControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableStream;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableStreamDefaultControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function ReadableStreamDefaultControllerClose(controller) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        controller._closeRequested = true;
        if (controller._queue.length === 0) {
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
      }
      function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          ReadableStreamFulfillReadRequest(stream, chunk, false);
        } else {
          let chunkSize;
          try {
            chunkSize = controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            ReadableStreamDefaultControllerError(controller, chunkSizeE);
            throw chunkSizeE;
          }
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            ReadableStreamDefaultControllerError(controller, enqueueE);
            throw enqueueE;
          }
        }
        ReadableStreamDefaultControllerCallPullIfNeeded(controller);
      }
      function ReadableStreamDefaultControllerError(controller, e2) {
        const stream = controller._controlledReadableStream;
        if (stream._state !== "readable") {
          return;
        }
        ResetQueue(controller);
        ReadableStreamDefaultControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableStreamDefaultControllerGetDesiredSize(controller) {
        const state = controller._controlledReadableStream._state;
        if (state === "errored") {
          return null;
        }
        if (state === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableStreamDefaultControllerHasBackpressure(controller) {
        if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
          return false;
        }
        return true;
      }
      function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
        const state = controller._controlledReadableStream._state;
        if (!controller._closeRequested && state === "readable") {
          return true;
        }
        return false;
      }
      function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledReadableStream = stream;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._started = false;
        controller._closeRequested = false;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(controller, r2);
          return null;
        });
      }
      function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        let startAlgorithm;
        let pullAlgorithm;
        let cancelAlgorithm;
        if (underlyingSource.start !== void 0) {
          startAlgorithm = () => underlyingSource.start(controller);
        } else {
          startAlgorithm = () => void 0;
        }
        if (underlyingSource.pull !== void 0) {
          pullAlgorithm = () => underlyingSource.pull(controller);
        } else {
          pullAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (underlyingSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function defaultControllerBrandCheckException$1(name) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
      }
      function ReadableStreamTee(stream, cloneForBranch2) {
        if (IsReadableByteStreamController(stream._readableStreamController)) {
          return ReadableByteStreamTee(stream);
        }
        return ReadableStreamDefaultTee(stream);
      }
      function ReadableStreamDefaultTee(stream, cloneForBranch2) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgain = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve) => {
          resolveCancelPromise = resolve;
        });
        function pullAlgorithm() {
          if (reading) {
            readAgain = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const readRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgain = false;
                const chunk1 = chunk;
                const chunk2 = chunk;
                if (!canceled1) {
                  ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgain) {
                  pullAlgorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableStreamDefaultControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableStreamDefaultControllerClose(branch2._readableStreamController);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
        }
        branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
        branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
        uponRejection(reader._closedPromise, (r2) => {
          ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
          ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
          if (!canceled1 || !canceled2) {
            resolveCancelPromise(void 0);
          }
          return null;
        });
        return [branch1, branch2];
      }
      function ReadableByteStreamTee(stream) {
        let reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgainForBranch1 = false;
        let readAgainForBranch2 = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve) => {
          resolveCancelPromise = resolve;
        });
        function forwardReaderError(thisReader) {
          uponRejection(thisReader._closedPromise, (r2) => {
            if (thisReader !== reader) {
              return null;
            }
            ReadableByteStreamControllerError(branch1._readableStreamController, r2);
            ReadableByteStreamControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
            return null;
          });
        }
        function pullWithDefaultReader() {
          if (IsReadableStreamBYOBReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamDefaultReader(stream);
            forwardReaderError(reader);
          }
          const readRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const chunk1 = chunk;
                let chunk2 = chunk;
                if (!canceled1 && !canceled2) {
                  try {
                    chunk2 = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                }
                if (!canceled1) {
                  ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableByteStreamControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableByteStreamControllerClose(branch2._readableStreamController);
              }
              if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
              }
              if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
        }
        function pullWithBYOBReader(view, forBranch2) {
          if (IsReadableStreamDefaultReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamBYOBReader(stream);
            forwardReaderError(reader);
          }
          const byobBranch = forBranch2 ? branch2 : branch1;
          const otherBranch = forBranch2 ? branch1 : branch2;
          const readIntoRequest = {
            _chunkSteps: (chunk) => {
              _queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!otherCanceled) {
                  let clonedChunk;
                  try {
                    clonedChunk = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                } else if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: (chunk) => {
              reading = false;
              const byobCanceled = forBranch2 ? canceled2 : canceled1;
              const otherCanceled = forBranch2 ? canceled1 : canceled2;
              if (!byobCanceled) {
                ReadableByteStreamControllerClose(byobBranch._readableStreamController);
              }
              if (!otherCanceled) {
                ReadableByteStreamControllerClose(otherBranch._readableStreamController);
              }
              if (chunk !== void 0) {
                if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                }
              }
              if (!byobCanceled || !otherCanceled) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamBYOBReaderRead(reader, view, 1, readIntoRequest);
        }
        function pull1Algorithm() {
          if (reading) {
            readAgainForBranch1 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, false);
          }
          return promiseResolvedWith(void 0);
        }
        function pull2Algorithm() {
          if (reading) {
            readAgainForBranch2 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, true);
          }
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
          return;
        }
        branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
        branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
        forwardReaderError(reader);
        return [branch1, branch2];
      }
      function isReadableStreamLike(stream) {
        return typeIsObject(stream) && typeof stream.getReader !== "undefined";
      }
      function ReadableStreamFrom(source) {
        if (isReadableStreamLike(source)) {
          return ReadableStreamFromDefaultReader(source.getReader());
        }
        return ReadableStreamFromIterable(source);
      }
      function ReadableStreamFromIterable(asyncIterable) {
        let stream;
        const iteratorRecord = GetIterator(asyncIterable, "async");
        const startAlgorithm = noop2;
        function pullAlgorithm() {
          let nextResult;
          try {
            nextResult = IteratorNext(iteratorRecord);
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const nextPromise = promiseResolvedWith(nextResult);
          return transformPromiseWith(nextPromise, (iterResult) => {
            if (!typeIsObject(iterResult)) {
              throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            }
            const done = IteratorComplete(iterResult);
            if (done) {
              ReadableStreamDefaultControllerClose(stream._readableStreamController);
            } else {
              const value = IteratorValue(iterResult);
              ReadableStreamDefaultControllerEnqueue(stream._readableStreamController, value);
            }
          });
        }
        function cancelAlgorithm(reason) {
          const iterator = iteratorRecord.iterator;
          let returnMethod;
          try {
            returnMethod = GetMethod(iterator, "return");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          if (returnMethod === void 0) {
            return promiseResolvedWith(void 0);
          }
          let returnResult;
          try {
            returnResult = reflectCall(returnMethod, iterator, [reason]);
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          const returnPromise = promiseResolvedWith(returnResult);
          return transformPromiseWith(returnPromise, (iterResult) => {
            if (!typeIsObject(iterResult)) {
              throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
            }
            return void 0;
          });
        }
        stream = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, 0);
        return stream;
      }
      function ReadableStreamFromDefaultReader(reader) {
        let stream;
        const startAlgorithm = noop2;
        function pullAlgorithm() {
          let readPromise;
          try {
            readPromise = reader.read();
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          return transformPromiseWith(readPromise, (readResult) => {
            if (!typeIsObject(readResult)) {
              throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            }
            if (readResult.done) {
              ReadableStreamDefaultControllerClose(stream._readableStreamController);
            } else {
              const value = readResult.value;
              ReadableStreamDefaultControllerEnqueue(stream._readableStreamController, value);
            }
          });
        }
        function cancelAlgorithm(reason) {
          try {
            return promiseResolvedWith(reader.cancel(reason));
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
        }
        stream = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, 0);
        return stream;
      }
      function convertUnderlyingDefaultOrByteSource(source, context) {
        assertDictionary(source, context);
        const original = source;
        const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
        const pull = original === null || original === void 0 ? void 0 : original.pull;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        return {
          autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
          cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
          pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
          type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
        };
      }
      function convertUnderlyingSourceCancelCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      function convertUnderlyingSourcePullCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => promiseCall(fn, original, [controller]);
      }
      function convertUnderlyingSourceStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertReadableStreamType(type, context) {
        type = `${type}`;
        if (type !== "bytes") {
          throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
        }
        return type;
      }
      function convertIteratorOptions(options, context) {
        assertDictionary(options, context);
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        return { preventCancel: Boolean(preventCancel) };
      }
      function convertPipeOptions(options, context) {
        assertDictionary(options, context);
        const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
        const signal = options === null || options === void 0 ? void 0 : options.signal;
        if (signal !== void 0) {
          assertAbortSignal(signal, `${context} has member 'signal' that`);
        }
        return {
          preventAbort: Boolean(preventAbort),
          preventCancel: Boolean(preventCancel),
          preventClose: Boolean(preventClose),
          signal
        };
      }
      function assertAbortSignal(signal, context) {
        if (!isAbortSignal2(signal)) {
          throw new TypeError(`${context} is not an AbortSignal.`);
        }
      }
      function convertReadableWritablePair(pair, context) {
        assertDictionary(pair, context);
        const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
        assertRequiredField(readable, "readable", "ReadableWritablePair");
        assertReadableStream(readable, `${context} has member 'readable' that`);
        const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
        assertRequiredField(writable, "writable", "ReadableWritablePair");
        assertWritableStream(writable, `${context} has member 'writable' that`);
        return { readable, writable };
      }
      class ReadableStream2 {
        constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
          if (rawUnderlyingSource === void 0) {
            rawUnderlyingSource = null;
          } else {
            assertObject(rawUnderlyingSource, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
          InitializeReadableStream(this);
          if (underlyingSource.type === "bytes") {
            if (strategy.size !== void 0) {
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            }
            const highWaterMark = ExtractHighWaterMark(strategy, 0);
            SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
          } else {
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
          }
        }
        /**
         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
         */
        get locked() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("locked");
          }
          return IsReadableStreamLocked(this);
        }
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        cancel(reason = void 0) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("cancel"));
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
          }
          return ReadableStreamCancel(this, reason);
        }
        getReader(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("getReader");
          }
          const options = convertReaderOptions(rawOptions, "First parameter");
          if (options.mode === void 0) {
            return AcquireReadableStreamDefaultReader(this);
          }
          return AcquireReadableStreamBYOBReader(this);
        }
        pipeThrough(rawTransform, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("pipeThrough");
          }
          assertRequiredArgument(rawTransform, 1, "pipeThrough");
          const transform = convertReadableWritablePair(rawTransform, "First parameter");
          const options = convertPipeOptions(rawOptions, "Second parameter");
          if (IsReadableStreamLocked(this)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          }
          if (IsWritableStreamLocked(transform.writable)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          }
          const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          setPromiseIsHandledToTrue(promise);
          return transform.readable;
        }
        pipeTo(destination, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
          }
          if (destination === void 0) {
            return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
          }
          if (!IsWritableStream(destination)) {
            return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
          }
          let options;
          try {
            options = convertPipeOptions(rawOptions, "Second parameter");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
          }
          if (IsWritableStreamLocked(destination)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
          }
          return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
        }
        /**
         * Tees this readable stream, returning a two-element array containing the two resulting branches as
         * new {@link ReadableStream} instances.
         *
         * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
         * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
         * propagated to the stream's underlying source.
         *
         * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
         * this could allow interference between the two branches.
         */
        tee() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("tee");
          }
          const branches = ReadableStreamTee(this);
          return CreateArrayFromList(branches);
        }
        values(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("values");
          }
          const options = convertIteratorOptions(rawOptions, "First parameter");
          return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
        }
        [SymbolAsyncIterator](options) {
          return this.values(options);
        }
        /**
         * Creates a new ReadableStream wrapping the provided iterable or async iterable.
         *
         * This can be used to adapt various kinds of objects into a readable stream,
         * such as an array, an async generator, or a Node.js readable stream.
         */
        static from(asyncIterable) {
          return ReadableStreamFrom(asyncIterable);
        }
      }
      Object.defineProperties(ReadableStream2, {
        from: { enumerable: true }
      });
      Object.defineProperties(ReadableStream2.prototype, {
        cancel: { enumerable: true },
        getReader: { enumerable: true },
        pipeThrough: { enumerable: true },
        pipeTo: { enumerable: true },
        tee: { enumerable: true },
        values: { enumerable: true },
        locked: { enumerable: true }
      });
      setFunctionName(ReadableStream2.from, "from");
      setFunctionName(ReadableStream2.prototype.cancel, "cancel");
      setFunctionName(ReadableStream2.prototype.getReader, "getReader");
      setFunctionName(ReadableStream2.prototype.pipeThrough, "pipeThrough");
      setFunctionName(ReadableStream2.prototype.pipeTo, "pipeTo");
      setFunctionName(ReadableStream2.prototype.tee, "tee");
      setFunctionName(ReadableStream2.prototype.values, "values");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ReadableStream2.prototype, Symbol.toStringTag, {
          value: "ReadableStream",
          configurable: true
        });
      }
      Object.defineProperty(ReadableStream2.prototype, SymbolAsyncIterator, {
        value: ReadableStream2.prototype.values,
        writable: true,
        configurable: true
      });
      function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableByteStreamController.prototype);
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
        return stream;
      }
      function InitializeReadableStream(stream) {
        stream._state = "readable";
        stream._reader = void 0;
        stream._storedError = void 0;
        stream._disturbed = false;
      }
      function IsReadableStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
          return false;
        }
        return x2 instanceof ReadableStream2;
      }
      function IsReadableStreamLocked(stream) {
        if (stream._reader === void 0) {
          return false;
        }
        return true;
      }
      function ReadableStreamCancel(stream, reason) {
        stream._disturbed = true;
        if (stream._state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (stream._state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        ReadableStreamClose(stream);
        const reader = stream._reader;
        if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
          const readIntoRequests = reader._readIntoRequests;
          reader._readIntoRequests = new SimpleQueue();
          readIntoRequests.forEach((readIntoRequest) => {
            readIntoRequest._closeSteps(void 0);
          });
        }
        const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
        return transformPromiseWith(sourceCancelPromise, noop2);
      }
      function ReadableStreamClose(stream) {
        stream._state = "closed";
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseResolve(reader);
        if (IsReadableStreamDefaultReader(reader)) {
          const readRequests = reader._readRequests;
          reader._readRequests = new SimpleQueue();
          readRequests.forEach((readRequest) => {
            readRequest._closeSteps();
          });
        }
      }
      function ReadableStreamError(stream, e2) {
        stream._state = "errored";
        stream._storedError = e2;
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseReject(reader, e2);
        if (IsReadableStreamDefaultReader(reader)) {
          ReadableStreamDefaultReaderErrorReadRequests(reader, e2);
        } else {
          ReadableStreamBYOBReaderErrorReadIntoRequests(reader, e2);
        }
      }
      function streamBrandCheckException$1(name) {
        return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
      }
      function convertQueuingStrategyInit(init2, context) {
        assertDictionary(init2, context);
        const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
        assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
        return {
          highWaterMark: convertUnrestrictedDouble(highWaterMark)
        };
      }
      const byteLengthSizeFunction = (chunk) => {
        return chunk.byteLength;
      };
      setFunctionName(byteLengthSizeFunction, "size");
      class ByteLengthQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("highWaterMark");
          }
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by returning the value of its `byteLength` property.
         */
        get size() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("size");
          }
          return byteLengthSizeFunction;
        }
      }
      Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(ByteLengthQueuingStrategy.prototype, Symbol.toStringTag, {
          value: "ByteLengthQueuingStrategy",
          configurable: true
        });
      }
      function byteLengthBrandCheckException(name) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
      }
      function IsByteLengthQueuingStrategy(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x2 instanceof ByteLengthQueuingStrategy;
      }
      const countSizeFunction = () => {
        return 1;
      };
      setFunctionName(countSizeFunction, "size");
      class CountQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "CountQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._countQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("highWaterMark");
          }
          return this._countQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by always returning 1.
         * This ensures that the total queue size is a count of the number of chunks in the queue.
         */
        get size() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("size");
          }
          return countSizeFunction;
        }
      }
      Object.defineProperties(CountQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(CountQueuingStrategy.prototype, Symbol.toStringTag, {
          value: "CountQueuingStrategy",
          configurable: true
        });
      }
      function countBrandCheckException(name) {
        return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
      }
      function IsCountQueuingStrategy(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x2 instanceof CountQueuingStrategy;
      }
      function convertTransformer(original, context) {
        assertDictionary(original, context);
        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
        const flush = original === null || original === void 0 ? void 0 : original.flush;
        const readableType = original === null || original === void 0 ? void 0 : original.readableType;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const transform = original === null || original === void 0 ? void 0 : original.transform;
        const writableType = original === null || original === void 0 ? void 0 : original.writableType;
        return {
          cancel: cancel === void 0 ? void 0 : convertTransformerCancelCallback(cancel, original, `${context} has member 'cancel' that`),
          flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
          readableType,
          start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
          transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
          writableType
        };
      }
      function convertTransformerFlushCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => promiseCall(fn, original, [controller]);
      }
      function convertTransformerStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertTransformerTransformCallback(fn, original, context) {
        assertFunction(fn, context);
        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
      }
      function convertTransformerCancelCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      class TransformStream {
        constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
          if (rawTransformer === void 0) {
            rawTransformer = null;
          }
          const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
          const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
          const transformer = convertTransformer(rawTransformer, "First parameter");
          if (transformer.readableType !== void 0) {
            throw new RangeError("Invalid readableType specified");
          }
          if (transformer.writableType !== void 0) {
            throw new RangeError("Invalid writableType specified");
          }
          const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
          const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
          const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
          const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
          let startPromise_resolve;
          const startPromise = newPromise((resolve) => {
            startPromise_resolve = resolve;
          });
          InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
          if (transformer.start !== void 0) {
            startPromise_resolve(transformer.start(this._transformStreamController));
          } else {
            startPromise_resolve(void 0);
          }
        }
        /**
         * The readable side of the transform stream.
         */
        get readable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("readable");
          }
          return this._readable;
        }
        /**
         * The writable side of the transform stream.
         */
        get writable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("writable");
          }
          return this._writable;
        }
      }
      Object.defineProperties(TransformStream.prototype, {
        readable: { enumerable: true },
        writable: { enumerable: true }
      });
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(TransformStream.prototype, Symbol.toStringTag, {
          value: "TransformStream",
          configurable: true
        });
      }
      function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
        function startAlgorithm() {
          return startPromise;
        }
        function writeAlgorithm(chunk) {
          return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
        }
        function abortAlgorithm(reason) {
          return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
        }
        function closeAlgorithm() {
          return TransformStreamDefaultSinkCloseAlgorithm(stream);
        }
        stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
        function pullAlgorithm() {
          return TransformStreamDefaultSourcePullAlgorithm(stream);
        }
        function cancelAlgorithm(reason) {
          return TransformStreamDefaultSourceCancelAlgorithm(stream, reason);
        }
        stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
        stream._backpressure = void 0;
        stream._backpressureChangePromise = void 0;
        stream._backpressureChangePromise_resolve = void 0;
        TransformStreamSetBackpressure(stream, true);
        stream._transformStreamController = void 0;
      }
      function IsTransformStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
          return false;
        }
        return x2 instanceof TransformStream;
      }
      function TransformStreamError(stream, e2) {
        ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
        TransformStreamErrorWritableAndUnblockWrite(stream, e2);
      }
      function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
        TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
        WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
        TransformStreamUnblockWrite(stream);
      }
      function TransformStreamUnblockWrite(stream) {
        if (stream._backpressure) {
          TransformStreamSetBackpressure(stream, false);
        }
      }
      function TransformStreamSetBackpressure(stream, backpressure) {
        if (stream._backpressureChangePromise !== void 0) {
          stream._backpressureChangePromise_resolve();
        }
        stream._backpressureChangePromise = newPromise((resolve) => {
          stream._backpressureChangePromise_resolve = resolve;
        });
        stream._backpressure = backpressure;
      }
      class TransformStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
         */
        get desiredSize() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("desiredSize");
          }
          const readableController = this._controlledTransformStream._readable._readableStreamController;
          return ReadableStreamDefaultControllerGetDesiredSize(readableController);
        }
        enqueue(chunk = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("enqueue");
          }
          TransformStreamDefaultControllerEnqueue(this, chunk);
        }
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        error(reason = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("error");
          }
          TransformStreamDefaultControllerError(this, reason);
        }
        /**
         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
         * transformer only needs to consume a portion of the chunks written to the writable side.
         */
        terminate() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("terminate");
          }
          TransformStreamDefaultControllerTerminate(this);
        }
      }
      Object.defineProperties(TransformStreamDefaultController.prototype, {
        enqueue: { enumerable: true },
        error: { enumerable: true },
        terminate: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      setFunctionName(TransformStreamDefaultController.prototype.enqueue, "enqueue");
      setFunctionName(TransformStreamDefaultController.prototype.error, "error");
      setFunctionName(TransformStreamDefaultController.prototype.terminate, "terminate");
      if (typeof Symbol.toStringTag === "symbol") {
        Object.defineProperty(TransformStreamDefaultController.prototype, Symbol.toStringTag, {
          value: "TransformStreamDefaultController",
          configurable: true
        });
      }
      function IsTransformStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
          return false;
        }
        return x2 instanceof TransformStreamDefaultController;
      }
      function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm, cancelAlgorithm) {
        controller._controlledTransformStream = stream;
        stream._transformStreamController = controller;
        controller._transformAlgorithm = transformAlgorithm;
        controller._flushAlgorithm = flushAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._finishPromise = void 0;
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
        const controller = Object.create(TransformStreamDefaultController.prototype);
        let transformAlgorithm;
        let flushAlgorithm;
        let cancelAlgorithm;
        if (transformer.transform !== void 0) {
          transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
        } else {
          transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
        }
        if (transformer.flush !== void 0) {
          flushAlgorithm = () => transformer.flush(controller);
        } else {
          flushAlgorithm = () => promiseResolvedWith(void 0);
        }
        if (transformer.cancel !== void 0) {
          cancelAlgorithm = (reason) => transformer.cancel(reason);
        } else {
          cancelAlgorithm = () => promiseResolvedWith(void 0);
        }
        SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm, cancelAlgorithm);
      }
      function TransformStreamDefaultControllerClearAlgorithms(controller) {
        controller._transformAlgorithm = void 0;
        controller._flushAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
      }
      function TransformStreamDefaultControllerEnqueue(controller, chunk) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
          throw new TypeError("Readable side is not in a state that permits enqueue");
        }
        try {
          ReadableStreamDefaultControllerEnqueue(readableController, chunk);
        } catch (e2) {
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
          throw stream._readable._storedError;
        }
        const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
        if (backpressure !== stream._backpressure) {
          TransformStreamSetBackpressure(stream, true);
        }
      }
      function TransformStreamDefaultControllerError(controller, e2) {
        TransformStreamError(controller._controlledTransformStream, e2);
      }
      function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
        const transformPromise = controller._transformAlgorithm(chunk);
        return transformPromiseWith(transformPromise, void 0, (r2) => {
          TransformStreamError(controller._controlledTransformStream, r2);
          throw r2;
        });
      }
      function TransformStreamDefaultControllerTerminate(controller) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        ReadableStreamDefaultControllerClose(readableController);
        const error = new TypeError("TransformStream terminated");
        TransformStreamErrorWritableAndUnblockWrite(stream, error);
      }
      function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
        const controller = stream._transformStreamController;
        if (stream._backpressure) {
          const backpressureChangePromise = stream._backpressureChangePromise;
          return transformPromiseWith(backpressureChangePromise, () => {
            const writable = stream._writable;
            const state = writable._state;
            if (state === "erroring") {
              throw writable._storedError;
            }
            return TransformStreamDefaultControllerPerformTransform(controller, chunk);
          });
        }
        return TransformStreamDefaultControllerPerformTransform(controller, chunk);
      }
      function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const readable = stream._readable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const cancelPromise = controller._cancelAlgorithm(reason);
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(cancelPromise, () => {
          if (readable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, readable._storedError);
          } else {
            ReadableStreamDefaultControllerError(readable._readableStreamController, reason);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(readable._readableStreamController, r2);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function TransformStreamDefaultSinkCloseAlgorithm(stream) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const readable = stream._readable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const flushPromise = controller._flushAlgorithm();
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(flushPromise, () => {
          if (readable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, readable._storedError);
          } else {
            ReadableStreamDefaultControllerClose(readable._readableStreamController);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          ReadableStreamDefaultControllerError(readable._readableStreamController, r2);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function TransformStreamDefaultSourcePullAlgorithm(stream) {
        TransformStreamSetBackpressure(stream, false);
        return stream._backpressureChangePromise;
      }
      function TransformStreamDefaultSourceCancelAlgorithm(stream, reason) {
        const controller = stream._transformStreamController;
        if (controller._finishPromise !== void 0) {
          return controller._finishPromise;
        }
        const writable = stream._writable;
        controller._finishPromise = newPromise((resolve, reject) => {
          controller._finishPromise_resolve = resolve;
          controller._finishPromise_reject = reject;
        });
        const cancelPromise = controller._cancelAlgorithm(reason);
        TransformStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(cancelPromise, () => {
          if (writable._state === "errored") {
            defaultControllerFinishPromiseReject(controller, writable._storedError);
          } else {
            WritableStreamDefaultControllerErrorIfNeeded(writable._writableStreamController, reason);
            TransformStreamUnblockWrite(stream);
            defaultControllerFinishPromiseResolve(controller);
          }
          return null;
        }, (r2) => {
          WritableStreamDefaultControllerErrorIfNeeded(writable._writableStreamController, r2);
          TransformStreamUnblockWrite(stream);
          defaultControllerFinishPromiseReject(controller, r2);
          return null;
        });
        return controller._finishPromise;
      }
      function defaultControllerBrandCheckException(name) {
        return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
      }
      function defaultControllerFinishPromiseResolve(controller) {
        if (controller._finishPromise_resolve === void 0) {
          return;
        }
        controller._finishPromise_resolve();
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function defaultControllerFinishPromiseReject(controller, reason) {
        if (controller._finishPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(controller._finishPromise);
        controller._finishPromise_reject(reason);
        controller._finishPromise_resolve = void 0;
        controller._finishPromise_reject = void 0;
      }
      function streamBrandCheckException(name) {
        return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
      }
      exports3.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
      exports3.CountQueuingStrategy = CountQueuingStrategy;
      exports3.ReadableByteStreamController = ReadableByteStreamController;
      exports3.ReadableStream = ReadableStream2;
      exports3.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
      exports3.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
      exports3.ReadableStreamDefaultController = ReadableStreamDefaultController;
      exports3.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
      exports3.TransformStream = TransformStream;
      exports3.TransformStreamDefaultController = TransformStreamDefaultController;
      exports3.WritableStream = WritableStream;
      exports3.WritableStreamDefaultController = WritableStreamDefaultController;
      exports3.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
    });
  }
});

// node_modules/fetch-blob/streams.cjs
var require_streams = __commonJS({
  "node_modules/fetch-blob/streams.cjs"() {
    var POOL_SIZE2 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("node:process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error) {
          process2.emitWarning = emitWarning;
          throw error;
        }
      } catch (error) {
        Object.assign(globalThis, require_ponyfill_es2018());
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE2));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error) {
    }
  }
});

// node_modules/fetch-blob/index.js
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* (
        /** @type {AsyncIterableIterator<Uint8Array>} */
        part.stream()
      );
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b = (
        /** @type {Blob} */
        part
      );
      while (position !== b.size) {
        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
var import_streams, POOL_SIZE, _Blob, Blob2, fetch_blob_default;
var init_fetch_blob = __esm({
  "node_modules/fetch-blob/index.js"() {
    import_streams = __toESM(require_streams(), 1);
    POOL_SIZE = 65536;
    _Blob = class Blob {
      /** @type {Array.<(Blob|Uint8Array)>} */
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      /**
       * The Blob() constructor returns a new Blob object. The content
       * of the blob consists of the concatenation of the values given
       * in the parameter array.
       *
       * @param {*} blobParts
       * @param {{ type?: string, endings?: string }} [options]
       */
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null) options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder.encode(`${element}`);
          }
          this.#size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
          this.#parts.push(part);
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      /**
       * The Blob interface's size property returns the
       * size of the Blob in bytes.
       */
      get size() {
        return this.#size;
      }
      /**
       * The type property of a Blob object returns the MIME type of the file.
       */
      get type() {
        return this.#type;
      }
      /**
       * The text() method in the Blob interface returns a Promise
       * that resolves with a string containing the contents of
       * the blob, interpreted as UTF-8.
       *
       * @return {Promise<string>}
       */
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      /**
       * The arrayBuffer() method in the Blob interface returns a
       * Promise that resolves with the contents of the blob as
       * binary data contained in an ArrayBuffer.
       *
       * @return {Promise<ArrayBuffer>}
       */
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          // @ts-ignore
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      /**
       * The Blob interface's slice() method creates and returns a
       * new Blob object which contains data from a subset of the
       * blob on which it's called.
       *
       * @param {number} [start]
       * @param {number} [end]
       * @param {string} [type]
       */
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    fetch_blob_default = Blob2;
  }
});

// node_modules/fetch-blob/file.js
var _File, File2, file_default;
var init_file = __esm({
  "node_modules/fetch-blob/file.js"() {
    init_fetch_blob();
    _File = class File extends fetch_blob_default {
      #lastModified = 0;
      #name = "";
      /**
       * @param {*[]} fileBits
       * @param {string} fileName
       * @param {{lastModified?: number, type?: string}} options
       */
      // @ts-ignore
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null) options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof fetch_blob_default && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    File2 = _File;
    file_default = File2;
  }
});

// node_modules/formdata-polyfill/esm.min.js
function formDataToBlob(F2, B = fetch_blob_default) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
var t, i, h, r, m, f, e, x, FormData;
var init_esm_min = __esm({
  "node_modules/formdata-polyfill/esm.min.js"() {
    init_fetch_blob();
    init_file();
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new file_default([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = class FormData2 {
      #d = [];
      constructor(...a) {
        if (a.length) throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++) if (b[c][0] === a) return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this) a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this) yield a;
      }
      *values() {
        for (var [, a] of this) yield a;
      }
    };
  }
});

// node_modules/node-domexception/index.js
var require_node_domexception = __commonJS({
  "node_modules/node-domexception/index.js"(exports2, module2) {
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    module2.exports = globalThis.DOMException;
  }
});

// node_modules/fetch-blob/from.js
var import_node_fs, import_node_domexception, stat;
var init_from = __esm({
  "node_modules/fetch-blob/from.js"() {
    import_node_fs = require("node:fs");
    import_node_domexception = __toESM(require_node_domexception(), 1);
    init_file();
    init_fetch_blob();
    ({ stat } = import_node_fs.promises);
  }
});

// node_modules/node-fetch/src/utils/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new file_default(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var s, S, f2, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/node-fetch/src/utils/multipart-parser.js"() {
    init_from();
    init_esm_min();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f2 = 1;
    F = {
      PART_BOUNDARY: f2,
      LAST_BOUNDARY: f2 *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      /**
       * @param {string} boundary
       */
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      /**
       * @param {Uint8Array} data
       */
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            // falls through
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            // falls through
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            // falls through
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// src/searchMyOpenPullRequests.tsx
var searchMyOpenPullRequests_exports = {};
__export(searchMyOpenPullRequests_exports, {
  default: () => SearchPullRequests
});
module.exports = __toCommonJS(searchMyOpenPullRequests_exports);
var import_api2 = require("@raycast/api");
var import_react = require("react");

// src/helpers/bitbucket.ts
var import_api = require("@raycast/api");

// node_modules/node-fetch/src/index.js
var import_node_http2 = __toESM(require("node:http"), 1);
var import_node_https = __toESM(require("node:https"), 1);
var import_node_zlib = __toESM(require("node:zlib"), 1);
var import_node_stream2 = __toESM(require("node:stream"), 1);
var import_node_buffer2 = require("node:buffer");

// node_modules/data-uri-to-buffer/dist/index.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base64 = true;
    } else if (meta[i2]) {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var dist_default = dataUriToBuffer;

// node_modules/node-fetch/src/body.js
var import_node_stream = __toESM(require("node:stream"), 1);
var import_node_util = require("node:util");
var import_node_buffer = require("node:buffer");
init_fetch_blob();
init_esm_min();

// node_modules/node-fetch/src/errors/base.js
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};

// node_modules/node-fetch/src/errors/fetch-error.js
var FetchError = class extends FetchBaseError {
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};

// node_modules/node-fetch/src/utils/is.js
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
var isAbortSignal = (object) => {
  return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
};
var isDomainOrSubdomain = (destination, original) => {
  const orig = new URL(original).hostname;
  const dest = new URL(destination).hostname;
  return orig === dest || orig.endsWith(`.${dest}`);
};
var isSameProtocol = (destination, original) => {
  const orig = new URL(original).protocol;
  const dest = new URL(destination).protocol;
  return orig === dest;
};

// node_modules/node-fetch/src/body.js
var pipeline = (0, import_node_util.promisify)(import_node_stream.default.pipeline);
var INTERNALS = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = import_node_buffer.Buffer.from(body.toString());
    } else if (isBlob(body)) {
    } else if (import_node_buffer.Buffer.isBuffer(body)) {
    } else if (import_node_util.types.isAnyArrayBuffer(body)) {
      body = import_node_buffer.Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = import_node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_node_stream.default) {
    } else if (body instanceof FormData) {
      body = formDataToBlob(body);
      boundary = body.type.split("=")[1];
    } else {
      body = import_node_buffer.Buffer.from(String(body));
    }
    let stream = body;
    if (import_node_buffer.Buffer.isBuffer(body)) {
      stream = import_node_stream.default.Readable.from(body);
    } else if (isBlob(body)) {
      stream = import_node_stream.default.Readable.from(body.stream());
    }
    this[INTERNALS] = {
      body,
      stream,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_node_stream.default) {
      body.on("error", (error_) => {
        const error = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
        this[INTERNALS].error = error;
      });
    }
  }
  get body() {
    return this[INTERNALS].stream;
  }
  get bodyUsed() {
    return this[INTERNALS].disturbed;
  }
  /**
   * Decode response as ArrayBuffer
   *
   * @return  Promise
   */
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async formData() {
    const ct = this.headers.get("content-type");
    if (ct.startsWith("application/x-www-form-urlencoded")) {
      const formData = new FormData();
      const parameters = new URLSearchParams(await this.text());
      for (const [name, value] of parameters) {
        formData.append(name, value);
      }
      return formData;
    }
    const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
    return toFormData2(this.body, ct);
  }
  /**
   * Return raw response as Blob
   *
   * @return Promise
   */
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS].body && this[INTERNALS].body.type || "";
    const buf = await this.arrayBuffer();
    return new fetch_blob_default([buf], {
      type: ct
    });
  }
  /**
   * Decode response as json
   *
   * @return  Promise
   */
  async json() {
    const text = await this.text();
    return JSON.parse(text);
  }
  /**
   * Decode response as text
   *
   * @return  Promise
   */
  async text() {
    const buffer = await consumeBody(this);
    return new TextDecoder().decode(buffer);
  }
  /**
   * Decode response as buffer (non-spec api)
   *
   * @return  Promise
   */
  buffer() {
    return consumeBody(this);
  }
};
Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true },
  data: { get: (0, import_node_util.deprecate)(
    () => {
    },
    "data doesn't exist, use json(), text(), arrayBuffer(), or body instead",
    "https://github.com/node-fetch/node-fetch/issues/1000 (response)"
  ) }
});
async function consumeBody(data) {
  if (data[INTERNALS].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS].disturbed = true;
  if (data[INTERNALS].error) {
    throw data[INTERNALS].error;
  }
  const { body } = data;
  if (body === null) {
    return import_node_buffer.Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return import_node_buffer.Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error);
        throw error;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error) {
    const error_ = error instanceof FetchBaseError ? error : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return import_node_buffer.Buffer.from(accum.join(""));
      }
      return import_node_buffer.Buffer.concat(accum, accumBytes);
    } catch (error) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance[INTERNALS];
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_node_stream.PassThrough({ highWaterMark });
    p2 = new import_node_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS].stream = p1;
    body = p2;
  }
  return body;
};
var getNonSpecFormDataBoundary = (0, import_node_util.deprecate)(
  (body) => body.getBoundary(),
  "form-data doesn't follow the spec and requires special treatment. Use alternative package",
  "https://github.com/node-fetch/node-fetch/issues/1167"
);
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (import_node_buffer.Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body instanceof FormData) {
    return `multipart/form-data; boundary=${request[INTERNALS].boundary}`;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
  }
  if (body instanceof import_node_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request[INTERNALS];
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (import_node_buffer.Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  return null;
};
var writeToStream = async (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else {
    await pipeline(body, dest);
  }
};

// node_modules/node-fetch/src/headers.js
var import_node_util2 = require("node:util");
var import_node_http = __toESM(require("node:http"), 1);
var validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const error = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(error, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw error;
  }
};
var validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const error = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(error, "code", { value: "ERR_INVALID_CHAR" });
    throw error;
  }
};
var Headers = class _Headers extends URLSearchParams {
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  constructor(init2) {
    let result = [];
    if (init2 instanceof _Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null) {
    } else if (typeof init2 === "object" && !import_node_util2.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_node_util2.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(
                target,
                String(name).toLowerCase(),
                String(value)
              );
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(
                target,
                String(name).toLowerCase()
              );
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback, thisArg = void 0) {
    for (const name of this.keys()) {
      Reflect.apply(callback, thisArg, [this.get(name), name, this]);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  /**
   * @type {() => IterableIterator<[string, string]>}
   */
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Node-fetch non-spec method
   * returning all headers and their values as array
   * @returns {Record<string, string[]>}
   */
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  /**
   * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(
  Headers.prototype,
  ["get", "entries", "forEach", "values"].reduce((result, property) => {
    result[property] = { enumerable: true };
    return result;
  }, {})
);
function fromRawHeaders(headers2 = []) {
  return new Headers(
    headers2.reduce((result, value, index, array) => {
      if (index % 2 === 0) {
        result.push(array.slice(index, index + 2));
      }
      return result;
    }, []).filter(([name, value]) => {
      try {
        validateHeaderName(name);
        validateHeaderValue(name, String(value));
        return true;
      } catch {
        return false;
      }
    })
  );
}

// node_modules/node-fetch/src/utils/is-redirect.js
var redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};

// node_modules/node-fetch/src/response.js
var INTERNALS2 = Symbol("Response internals");
var Response = class _Response extends Body {
  constructor(body = null, options = {}) {
    super(body, options);
    const status = options.status != null ? options.status : 200;
    const headers2 = new Headers(options.headers);
    if (body !== null && !headers2.has("Content-Type")) {
      const contentType = extractContentType(body, this);
      if (contentType) {
        headers2.append("Content-Type", contentType);
      }
    }
    this[INTERNALS2] = {
      type: "default",
      url: options.url,
      status,
      statusText: options.statusText || "",
      headers: headers2,
      counter: options.counter,
      highWaterMark: options.highWaterMark
    };
  }
  get type() {
    return this[INTERNALS2].type;
  }
  get url() {
    return this[INTERNALS2].url || "";
  }
  get status() {
    return this[INTERNALS2].status;
  }
  /**
   * Convenience property representing if the request ended normally
   */
  get ok() {
    return this[INTERNALS2].status >= 200 && this[INTERNALS2].status < 300;
  }
  get redirected() {
    return this[INTERNALS2].counter > 0;
  }
  get statusText() {
    return this[INTERNALS2].statusText;
  }
  get headers() {
    return this[INTERNALS2].headers;
  }
  get highWaterMark() {
    return this[INTERNALS2].highWaterMark;
  }
  /**
   * Clone this response
   *
   * @return  Response
   */
  clone() {
    return new _Response(clone(this, this.highWaterMark), {
      type: this.type,
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size,
      highWaterMark: this.highWaterMark
    });
  }
  /**
   * @param {string} url    The URL that the new response is to originate from.
   * @param {number} status An optional status code for the response (e.g., 302.)
   * @returns {Response}    A Response object.
   */
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new _Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  static error() {
    const response = new _Response(null, { status: 0, statusText: "" });
    response[INTERNALS2].type = "error";
    return response;
  }
  static json(data = void 0, init2 = {}) {
    const body = JSON.stringify(data);
    if (body === void 0) {
      throw new TypeError("data is not JSON serializable");
    }
    const headers2 = new Headers(init2 && init2.headers);
    if (!headers2.has("content-type")) {
      headers2.set("content-type", "application/json");
    }
    return new _Response(body, {
      ...init2,
      headers: headers2
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  type: { enumerable: true },
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});

// node_modules/node-fetch/src/request.js
var import_node_url = require("node:url");
var import_node_util3 = require("node:util");

// node_modules/node-fetch/src/utils/get-search.js
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
};

// node_modules/node-fetch/src/utils/referrer.js
var import_node_net = require("node:net");
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
var ReferrerPolicy = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]);
var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_node_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (url.host === "localhost" || url.host.endsWith(".localhost")) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers2) {
  const policyTokens = (headers2.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}

// node_modules/node-fetch/src/request.js
var INTERNALS3 = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS3] === "object";
};
var doBadDataWarn = (0, import_node_util3.deprecate)(
  () => {
  },
  ".data is not a valid RequestInit property, use .body instead",
  "https://github.com/node-fetch/node-fetch/issues/1000 (request)"
);
var Request = class _Request extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    if (parsedURL.username !== "" || parsedURL.password !== "") {
      throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
    }
    let method = init2.method || input.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(method)) {
      method = method.toUpperCase();
    }
    if (!isRequest(init2) && "data" in init2) {
      doBadDataWarn();
    }
    if ((init2.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers2 = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers2.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers2.set("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal != null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    }
    let referrer = init2.referrer == null ? input.referrer : init2.referrer;
    if (referrer === "") {
      referrer = "no-referrer";
    } else if (referrer) {
      const parsedReferrer = new URL(referrer);
      referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
    } else {
      referrer = void 0;
    }
    this[INTERNALS3] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers: headers2,
      parsedURL,
      signal,
      referrer
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
    this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
  }
  /** @returns {string} */
  get method() {
    return this[INTERNALS3].method;
  }
  /** @returns {string} */
  get url() {
    return (0, import_node_url.format)(this[INTERNALS3].parsedURL);
  }
  /** @returns {Headers} */
  get headers() {
    return this[INTERNALS3].headers;
  }
  get redirect() {
    return this[INTERNALS3].redirect;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return this[INTERNALS3].signal;
  }
  // https://fetch.spec.whatwg.org/#dom-request-referrer
  get referrer() {
    if (this[INTERNALS3].referrer === "no-referrer") {
      return "";
    }
    if (this[INTERNALS3].referrer === "client") {
      return "about:client";
    }
    if (this[INTERNALS3].referrer) {
      return this[INTERNALS3].referrer.toString();
    }
    return void 0;
  }
  get referrerPolicy() {
    return this[INTERNALS3].referrerPolicy;
  }
  set referrerPolicy(referrerPolicy) {
    this[INTERNALS3].referrerPolicy = validateReferrerPolicy(referrerPolicy);
  }
  /**
   * Clone this request
   *
   * @return  Request
   */
  clone() {
    return new _Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true },
  referrer: { enumerable: true },
  referrerPolicy: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS3];
  const headers2 = new Headers(request[INTERNALS3].headers);
  if (!headers2.has("Accept")) {
    headers2.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers2.set("Content-Length", contentLengthValue);
  }
  if (request.referrerPolicy === "") {
    request.referrerPolicy = DEFAULT_REFERRER_POLICY;
  }
  if (request.referrer && request.referrer !== "no-referrer") {
    request[INTERNALS3].referrer = determineRequestsReferrer(request);
  } else {
    request[INTERNALS3].referrer = "no-referrer";
  }
  if (request[INTERNALS3].referrer instanceof URL) {
    headers2.set("Referer", request.referrer);
  }
  if (!headers2.has("User-Agent")) {
    headers2.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers2.has("Accept-Encoding")) {
    headers2.set("Accept-Encoding", "gzip, deflate, br");
  }
  let { agent: agent2 } = request;
  if (typeof agent2 === "function") {
    agent2 = agent2(parsedURL);
  }
  const search = getSearch(parsedURL);
  const options = {
    // Overwrite search to retain trailing ? (issue #776)
    path: parsedURL.pathname + search,
    // The following options are not expressed in the URL
    method: request.method,
    headers: headers2[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent: agent2
  };
  return {
    /** @type {URL} */
    parsedURL,
    options
  };
};

// node_modules/node-fetch/src/errors/abort-error.js
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};

// node_modules/node-fetch/src/index.js
init_esm_min();
init_from();
var supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve, reject) => {
    const request = new Request(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dist_default(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http2.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error = new AbortError("The operation was aborted.");
      reject(error);
      if (request.body && request.body instanceof import_node_stream2.default.Readable) {
        request.body.destroy(error);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL.toString(), options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error.message}`, "system", error));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error) => {
      if (response && response.body) {
        response.body.destroy(error);
      }
    });
    if (process.version < "v14") {
      request_.on("socket", (s2) => {
        let endedWithEventsCount;
        s2.prependListener("end", () => {
          endedWithEventsCount = s2._eventsCount;
        });
        s2.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s2._eventsCount && !hadError) {
            const error = new Error("Premature close");
            error.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers2 = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers2.get("Location");
        let locationURL = null;
        try {
          locationURL = location === null ? null : new URL(location, request.url);
        } catch {
          if (request.redirect !== "manual") {
            reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
            finalize();
            return;
          }
        }
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
              for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                requestOptions.headers.delete(name);
              }
            }
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream2.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers2);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error) => {
        if (error) {
          reject(error);
        }
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers: headers2,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers2.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), (error) => {
          if (error) {
            reject(error);
          }
        });
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error) => {
          if (error) {
            reject(error);
          }
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflate(), (error) => {
              if (error) {
                reject(error);
              }
            });
          } else {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflateRaw(), (error) => {
              if (error) {
                reject(error);
              }
            });
          }
          response = new Response(body, responseOptions);
          resolve(response);
        });
        raw.once("end", () => {
          if (!response) {
            response = new Response(body, responseOptions);
            resolve(response);
          }
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), (error) => {
          if (error) {
            reject(error);
          }
        });
        response = new Response(body, responseOptions);
        resolve(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve(response);
    });
    writeToStream(request_, request).catch(reject);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = import_node_buffer2.Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers: headers2 } = response;
    isChunkedTransfer = headers2["transfer-encoding"] === "chunked" && !headers2["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error = new Error("Premature close");
        error.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error);
      }
    };
    const onData = (buf) => {
      properLastChunkReceived = import_node_buffer2.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = import_node_buffer2.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && import_node_buffer2.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    };
    socket.prependListener("close", onSocketClose);
    socket.on("data", onData);
    request.on("close", () => {
      socket.removeListener("close", onSocketClose);
      socket.removeListener("data", onData);
    });
  });
}

// src/helpers/exception.ts
var ErrorText = (name, message) => ({ name, message });
var PresentableError = class extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
};

// src/helpers/bitbucket.ts
var https2 = __toESM(require("https"));
var prefs = (0, import_api.getPreferenceValues)();
var bitbucketUrl = `https://${prefs.domain}`;
var headers = {
  Accept: "application/json",
  Authorization: `Bearer ${prefs.token}`,
  "Content-Type": "application/json"
};
var agent = new https2.Agent({ rejectUnauthorized: !prefs.unsafeHTTPS });
var init = {
  headers,
  agent
};
async function bitbucketFetchObject(path, params = {}, statusErrors) {
  const response = await bitbucketFetch(path, params, statusErrors);
  return await response.json();
}
async function bitbucketFetch(path, params = {}, statusErrors) {
  const paramKeys = Object.keys(params);
  const query = paramKeys.map((key) => `${key}=${encodeURIComponent(params[key])}`).join("&");
  try {
    const sanitizedPath = path.startsWith("/") ? path.substring(1) : path;
    const url = `${bitbucketUrl}/${sanitizedPath}` + (query.length > 0 ? `?${query}` : "");
    const response = await fetch(url, init);
    throwIfResponseNotOkay(response, statusErrors);
    return response;
  } catch (error) {
    if (error instanceof FetchError) throw Error("Check your network connection");
    else throw error;
  }
}
var defaultStatusErrors = {
  401: ErrorText("Bitbucket Authentication failed", "Check your Bitbucket credentials in the preferences.")
};
function throwIfResponseNotOkay(response, statusErrors) {
  if (!response.ok) {
    const status = response.status;
    const definedStatus = statusErrors ? { ...defaultStatusErrors, ...statusErrors } : defaultStatusErrors;
    const exactStatusError = definedStatus[status];
    if (exactStatusError) throw new PresentableError(exactStatusError.name, exactStatusError.message);
    else if (status >= 500) throw new PresentableError("Bitbucket Error", `Server error ${status}`);
    else throw new PresentableError("Bitbucket Error", `Request error ${status}`);
  }
}

// src/queries/index.ts
async function getMyOpenPullRequests(start = 0, pullRequests = []) {
  const data = await bitbucketFetchObject("/rest/api/latest/dashboard/pull-requests", {
    state: "OPEN",
    start
  });
  pullRequests = pullRequests.concat(data.values);
  if (data.nextPageStart) {
    return getMyOpenPullRequests(data.nextPageStart, pullRequests);
  }
  return pullRequests;
}

// src/searchMyOpenPullRequests.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var toPullRequest = (pr) => {
  return {
    id: pr.id,
    title: pr.title,
    description: pr.description,
    repo: {
      name: pr.fromRef.repository.name
    },
    commentCount: pr.properties.commentCount || 0,
    author: {
      url: `${bitbucketUrl}/users/${pr.author.user.name}/avatar.png`,
      nickname: pr.author.user.name
    },
    url: pr.links?.self[0]?.href
  };
};
function SearchPullRequests() {
  const [state, setState] = (0, import_react.useState)({});
  (0, import_react.useEffect)(() => {
    const fetchPRs = async () => {
      try {
        const data = await getMyOpenPullRequests();
        const prs = data.map(toPullRequest);
        setState({ pullRequests: prs });
      } catch (error) {
        setState({ error: error instanceof Error ? error : new Error("Something went wrong") });
      }
    };
    fetchPRs();
  }, []);
  if (state.error) {
    (0, import_api2.showToast)(import_api2.Toast.Style.Failure, "Failed loading repositories", state.error.message);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.List, { isLoading: !state.pullRequests && !state.error, searchBarPlaceholder: "Search by name...", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.List.Section, { title: "Open Pull Requests", subtitle: state.pullRequests?.length + "", children: state.pullRequests?.map((pr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_api2.List.Item,
    {
      title: pr.title,
      subtitle: pr.description,
      accessories: [
        { text: `${pr.commentCount} \u{1F4AC}  \xB7  Created by ${pr.author.nickname}` },
        { icon: { source: pr.author.url, mask: import_api2.Image.Mask.Circle } }
      ],
      icon: { source: "icon-pr.png", tintColor: import_api2.Color.PrimaryText },
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Action.OpenInBrowser, { title: "Open Pull Request in Browser", url: `${pr.url}` }) }) })
    },
    pr.id
  )) }) });
}
/*! Bundled license information:

web-streams-polyfill/dist/ponyfill.es2018.js:
  (**
   * @license
   * web-streams-polyfill v3.3.3
   * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
   * This code is released under the MIT license.
   * SPDX-License-Identifier: MIT
   *)

fetch-blob/index.js:
  (*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

formdata-polyfill/esm.min.js:
  (*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

node-domexception/index.js:
  (*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL3V0aWxzLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvaGVscGVycy9taXNjZWxsYW5lb3VzLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvaGVscGVycy93ZWJpZGwudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9zaW1wbGUtcXVldWUudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcy50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9nZW5lcmljLXJlYWRlci50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvc3R1Yi9udW1iZXItaXNmaW5pdGUudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL3N0dWIvbWF0aC10cnVuYy50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvYmFzaWMudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3JlYWRhYmxlLXN0cmVhbS50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9kZWZhdWx0LXJlYWRlci50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvdGFyZ2V0L2VzMjAxOC9zdHViL2FzeW5jLWl0ZXJhdG9yLXByb3RvdHlwZS50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9hc3luYy1pdGVyYXRvci50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvc3R1Yi9udW1iZXItaXNuYW4udHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdC50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL2Fic3RyYWN0LW9wcy9taXNjZWxsYW5lb3VzLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvYWJzdHJhY3Qtb3BzL3F1ZXVlLXdpdGgtc2l6ZXMudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3LnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2J5dGUtc3RyZWFtLWNvbnRyb2xsZXIudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3JlYWRlci1vcHRpb25zLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2J5b2ItcmVhZGVyLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvYWJzdHJhY3Qtb3BzL3F1ZXVpbmctc3RyYXRlZ3kudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3kudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3VuZGVybHlpbmctc2luay50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3ZhbGlkYXRvcnMvd3JpdGFibGUtc3RyZWFtLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvYWJvcnQtc2lnbmFsLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvd3JpdGFibGUtc3RyZWFtLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9nbG9iYWxzLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9zdHViL2RvbS1leGNlcHRpb24udHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vcGlwZS50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3JlYWRhYmxlLXN0cmVhbS9kZWZhdWx0LWNvbnRyb2xsZXIudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0vdGVlLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLXN0cmVhbS1saWtlLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvcmVhZGFibGUtc3RyZWFtL2Zyb20udHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3VuZGVybHlpbmctc291cmNlLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9pdGVyYXRvci1vcHRpb25zLnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy9waXBlLW9wdGlvbnMudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3JlYWRhYmxlLXdyaXRhYmxlLXBhaXIudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9yZWFkYWJsZS1zdHJlYW0udHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3ktaW5pdC50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL2J5dGUtbGVuZ3RoLXF1ZXVpbmctc3RyYXRlZ3kudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvd2ViLXN0cmVhbXMtcG9seWZpbGwvc3JjL2xpYi9jb3VudC1xdWV1aW5nLXN0cmF0ZWd5LnRzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL3dlYi1zdHJlYW1zLXBvbHlmaWxsL3NyYy9saWIvdmFsaWRhdG9ycy90cmFuc2Zvcm1lci50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy93ZWItc3RyZWFtcy1wb2x5ZmlsbC9zcmMvbGliL3RyYW5zZm9ybS1zdHJlYW0udHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvZmV0Y2gtYmxvYi9zdHJlYW1zLmNqcyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy9mZXRjaC1ibG9iL2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL2ZldGNoLWJsb2IvZmlsZS5qcyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy9mb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL25vZGUtZG9tZXhjZXB0aW9uL2luZGV4LmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL2ZldGNoLWJsb2IvZnJvbS5qcyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9tdWx0aXBhcnQtcGFyc2VyLmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvc3JjL3NlYXJjaE15T3BlblB1bGxSZXF1ZXN0cy50c3giLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9zcmMvaGVscGVycy9iaXRidWNrZXQudHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvaW5kZXguanMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvZGF0YS11cmktdG8tYnVmZmVyL3NyYy9pbmRleC50cyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9ib2R5LmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL2Vycm9ycy9iYXNlLmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL2Vycm9ycy9mZXRjaC1lcnJvci5qcyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9pcy5qcyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9oZWFkZXJzLmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3V0aWxzL2lzLXJlZGlyZWN0LmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3Jlc3BvbnNlLmpzIiwgIi4uLy4uLy4uLy4uL0Rvd25sb2Fkcy9yYXljYXN0IGV4dGVuc2lvbnMgYjhjOGZjZDdlYmQ0NDFhNTQ1MmIzOTY5MjNmMmE0MGU4Nzk1NjViYSBleHRlbnNpb25zLWJpdGJ1Y2tldC1zZWFyY2gtc2VsZi1ob3N0ZWQvbm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvc3JjL3JlcXVlc3QuanMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9zcmMvdXRpbHMvZ2V0LXNlYXJjaC5qcyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy91dGlscy9yZWZlcnJlci5qcyIsICIuLi8uLi8uLi8uLi9Eb3dubG9hZHMvcmF5Y2FzdCBleHRlbnNpb25zIGI4YzhmY2Q3ZWJkNDQxYTU0NTJiMzk2OTIzZjJhNDBlODc5NTY1YmEgZXh0ZW5zaW9ucy1iaXRidWNrZXQtc2VhcmNoLXNlbGYtaG9zdGVkL25vZGVfbW9kdWxlcy9ub2RlLWZldGNoL3NyYy9lcnJvcnMvYWJvcnQtZXJyb3IuanMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9zcmMvaGVscGVycy9leGNlcHRpb24udHMiLCAiLi4vLi4vLi4vLi4vRG93bmxvYWRzL3JheWNhc3QgZXh0ZW5zaW9ucyBiOGM4ZmNkN2ViZDQ0MWE1NDUyYjM5NjkyM2YyYTQwZTg3OTU2NWJhIGV4dGVuc2lvbnMtYml0YnVja2V0LXNlYXJjaC1zZWxmLWhvc3RlZC9zcmMvcXVlcmllcy9pbmRleC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKTogdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsICJpbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgQXNzZXJ0aW9uRXJyb3IgfSBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlSXNPYmplY3QoeDogYW55KTogeCBpcyBvYmplY3Qge1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsKSB8fCB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZXhwb3J0IGNvbnN0IHJldGhyb3dBc3NlcnRpb25FcnJvclJlamVjdGlvbjogKGU6IGFueSkgPT4gdm9pZCA9XG4gIERFQlVHID8gZSA9PiB7XG4gICAgLy8gVXNlZCB0aHJvdWdob3V0IHRoZSByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24sIGFzIGAuY2F0Y2gocmV0aHJvd0Fzc2VydGlvbkVycm9yUmVqZWN0aW9uKWAsIHRvIGVuc3VyZSBhbnkgZXJyb3JzXG4gICAgLy8gZ2V0IHNob3duLiBUaGVyZSBhcmUgcGxhY2VzIGluIHRoZSBzcGVjIHdoZXJlIHdlIGRvIHByb21pc2UgdHJhbnNmb3JtYXRpb25zIGFuZCBwdXJwb3NlZnVsbHkgaWdub3JlIG9yIGRvbid0XG4gICAgLy8gZXhwZWN0IGFueSBlcnJvcnMsIGJ1dCBhc3NlcnRpb24gZXJyb3JzIGFyZSBhbHdheXMgcHJvYmxlbWF0aWMuXG4gICAgaWYgKGUgJiYgZSBpbnN0YW5jZW9mIEFzc2VydGlvbkVycm9yKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfSA6IG5vb3A7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRGdW5jdGlvbk5hbWUoZm46IEZ1bmN0aW9uLCBuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgdHJ5IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sICduYW1lJywge1xuICAgICAgdmFsdWU6IG5hbWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gVGhpcyBwcm9wZXJ0eSBpcyBub24tY29uZmlndXJhYmxlIGluIG9sZGVyIGJyb3dzZXJzLCBzbyBpZ25vcmUgaWYgdGhpcyB0aHJvd3MuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vbmFtZSNicm93c2VyX2NvbXBhdGliaWxpdHlcbiAgfVxufVxuIiwgImltcG9ydCB7IHJldGhyb3dBc3NlcnRpb25FcnJvclJlamVjdGlvbiB9IGZyb20gJy4vbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcblxuY29uc3Qgb3JpZ2luYWxQcm9taXNlID0gUHJvbWlzZTtcbmNvbnN0IG9yaWdpbmFsUHJvbWlzZVRoZW4gPSBQcm9taXNlLnByb3RvdHlwZS50aGVuO1xuY29uc3Qgb3JpZ2luYWxQcm9taXNlUmVqZWN0ID0gUHJvbWlzZS5yZWplY3QuYmluZChvcmlnaW5hbFByb21pc2UpO1xuXG4vLyBodHRwczovL3dlYmlkbC5zcGVjLndoYXR3Zy5vcmcvI2EtbmV3LXByb21pc2VcbmV4cG9ydCBmdW5jdGlvbiBuZXdQcm9taXNlPFQ+KGV4ZWN1dG9yOiAoXG4gIHJlc29sdmU6ICh2YWx1ZTogVCB8IFByb21pc2VMaWtlPFQ+KSA9PiB2b2lkLFxuICByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWRcbikgPT4gdm9pZCk6IFByb21pc2U8VD4ge1xuICByZXR1cm4gbmV3IG9yaWdpbmFsUHJvbWlzZShleGVjdXRvcik7XG59XG5cbi8vIGh0dHBzOi8vd2ViaWRsLnNwZWMud2hhdHdnLm9yZy8jYS1wcm9taXNlLXJlc29sdmVkLXdpdGhcbmV4cG9ydCBmdW5jdGlvbiBwcm9taXNlUmVzb2x2ZWRXaXRoPFQ+KHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pOiBQcm9taXNlPFQ+IHtcbiAgcmV0dXJuIG5ld1Byb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKHZhbHVlKSk7XG59XG5cbi8vIGh0dHBzOi8vd2ViaWRsLnNwZWMud2hhdHdnLm9yZy8jYS1wcm9taXNlLXJlamVjdGVkLXdpdGhcbmV4cG9ydCBmdW5jdGlvbiBwcm9taXNlUmVqZWN0ZWRXaXRoPFQgPSBuZXZlcj4ocmVhc29uOiBhbnkpOiBQcm9taXNlPFQ+IHtcbiAgcmV0dXJuIG9yaWdpbmFsUHJvbWlzZVJlamVjdChyZWFzb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUGVyZm9ybVByb21pc2VUaGVuPFQsIFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG4gIHByb21pc2U6IFByb21pc2U8VD4sXG4gIG9uRnVsZmlsbGVkPzogKHZhbHVlOiBUKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPixcbiAgb25SZWplY3RlZD86IChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj4pOiBQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+IHtcbiAgLy8gVGhlcmUgZG9lc24ndCBhcHBlYXIgdG8gYmUgYW55IHdheSB0byBjb3JyZWN0bHkgZW11bGF0ZSB0aGUgYmVoYXZpb3VyIGZyb20gSmF2YVNjcmlwdCwgc28gdGhpcyBpcyBqdXN0IGFuXG4gIC8vIGFwcHJveGltYXRpb24uXG4gIHJldHVybiBvcmlnaW5hbFByb21pc2VUaGVuLmNhbGwocHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIGFzIFByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj47XG59XG5cbi8vIEJsdWViaXJkIGxvZ3MgYSB3YXJuaW5nIHdoZW4gYSBwcm9taXNlIGlzIGNyZWF0ZWQgd2l0aGluIGEgZnVsZmlsbG1lbnQgaGFuZGxlciwgYnV0IHRoZW4gaXNuJ3QgcmV0dXJuZWRcbi8vIGZyb20gdGhhdCBoYW5kbGVyLiBUbyBwcmV2ZW50IHRoaXMsIHJldHVybiBudWxsIGluc3RlYWQgb2Ygdm9pZCBmcm9tIGFsbCBoYW5kbGVycy5cbi8vIGh0dHA6Ly9ibHVlYmlyZGpzLmNvbS9kb2NzL3dhcm5pbmctZXhwbGFuYXRpb25zLmh0bWwjd2FybmluZy1hLXByb21pc2Utd2FzLWNyZWF0ZWQtaW4tYS1oYW5kbGVyLWJ1dC13YXMtbm90LXJldHVybmVkLWZyb20taXRcbmV4cG9ydCBmdW5jdGlvbiB1cG9uUHJvbWlzZTxUPihcbiAgcHJvbWlzZTogUHJvbWlzZTxUPixcbiAgb25GdWxmaWxsZWQ/OiAodmFsdWU6IFQpID0+IG51bGwgfCBQcm9taXNlTGlrZTxudWxsPixcbiAgb25SZWplY3RlZD86IChyZWFzb246IGFueSkgPT4gbnVsbCB8IFByb21pc2VMaWtlPG51bGw+KTogdm9pZCB7XG4gIFBlcmZvcm1Qcm9taXNlVGhlbihcbiAgICBQZXJmb3JtUHJvbWlzZVRoZW4ocHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpLFxuICAgIHVuZGVmaW5lZCxcbiAgICByZXRocm93QXNzZXJ0aW9uRXJyb3JSZWplY3Rpb25cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwb25GdWxmaWxsbWVudDxUPihwcm9taXNlOiBQcm9taXNlPFQ+LCBvbkZ1bGZpbGxlZDogKHZhbHVlOiBUKSA9PiBudWxsIHwgUHJvbWlzZUxpa2U8bnVsbD4pOiB2b2lkIHtcbiAgdXBvblByb21pc2UocHJvbWlzZSwgb25GdWxmaWxsZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBvblJlamVjdGlvbihwcm9taXNlOiBQcm9taXNlPHVua25vd24+LCBvblJlamVjdGVkOiAocmVhc29uOiBhbnkpID0+IG51bGwgfCBQcm9taXNlTGlrZTxudWxsPik6IHZvaWQge1xuICB1cG9uUHJvbWlzZShwcm9taXNlLCB1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtUHJvbWlzZVdpdGg8VCwgVFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcbiAgcHJvbWlzZTogUHJvbWlzZTxUPixcbiAgZnVsZmlsbG1lbnRIYW5kbGVyPzogKHZhbHVlOiBUKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPixcbiAgcmVqZWN0aW9uSGFuZGxlcj86IChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj4pOiBQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+IHtcbiAgcmV0dXJuIFBlcmZvcm1Qcm9taXNlVGhlbihwcm9taXNlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZShwcm9taXNlOiBQcm9taXNlPHVua25vd24+KTogdm9pZCB7XG4gIFBlcmZvcm1Qcm9taXNlVGhlbihwcm9taXNlLCB1bmRlZmluZWQsIHJldGhyb3dBc3NlcnRpb25FcnJvclJlamVjdGlvbik7XG59XG5cbmxldCBfcXVldWVNaWNyb3Rhc2s6IChjYWxsYmFjazogKCkgPT4gdm9pZCkgPT4gdm9pZCA9IGNhbGxiYWNrID0+IHtcbiAgaWYgKHR5cGVvZiBxdWV1ZU1pY3JvdGFzayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIF9xdWV1ZU1pY3JvdGFzayA9IHF1ZXVlTWljcm90YXNrO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICBfcXVldWVNaWNyb3Rhc2sgPSBjYiA9PiBQZXJmb3JtUHJvbWlzZVRoZW4ocmVzb2x2ZWRQcm9taXNlLCBjYik7XG4gIH1cbiAgcmV0dXJuIF9xdWV1ZU1pY3JvdGFzayhjYWxsYmFjayk7XG59O1xuXG5leHBvcnQgeyBfcXVldWVNaWNyb3Rhc2sgYXMgcXVldWVNaWNyb3Rhc2sgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZmxlY3RDYWxsPFQsIEEgZXh0ZW5kcyBhbnlbXSwgUj4oRjogKHRoaXM6IFQsIC4uLmZuQXJnczogQSkgPT4gUiwgVjogVCwgYXJnczogQSk6IFIge1xuICBpZiAodHlwZW9mIEYgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChGLCBWLCBhcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2VDYWxsPFQsIEEgZXh0ZW5kcyBhbnlbXSwgUj4oRjogKHRoaXM6IFQsIC4uLmZuQXJnczogQSkgPT4gUiB8IFByb21pc2VMaWtlPFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVjogVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IEEpOiBQcm9taXNlPFI+IHtcbiAgYXNzZXJ0KHR5cGVvZiBGID09PSAnZnVuY3Rpb24nKTtcbiAgYXNzZXJ0KFYgIT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChBcnJheS5pc0FycmF5KGFyZ3MpKTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aChyZWZsZWN0Q2FsbChGLCBWLCBhcmdzKSk7XG4gIH0gY2F0Y2ggKHZhbHVlKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgodmFsdWUpO1xuICB9XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi9zdHViL2Fzc2VydCc7XG5cbi8vIE9yaWdpbmFsIGZyb20gQ2hyb21pdW1cbi8vIGh0dHBzOi8vY2hyb21pdW0uZ29vZ2xlc291cmNlLmNvbS9jaHJvbWl1bS9zcmMvKy8wYWVlNDQzNGE0ZGJhNDJhNDJhYmFlYTliZmJjMGNkMTk2YTYzYmMxL3RoaXJkX3BhcnR5L2JsaW5rL3JlbmRlcmVyL2NvcmUvc3RyZWFtcy9TaW1wbGVRdWV1ZS5qc1xuXG5jb25zdCBRVUVVRV9NQVhfQVJSQVlfU0laRSA9IDE2Mzg0O1xuXG5pbnRlcmZhY2UgTm9kZTxUPiB7XG4gIF9lbGVtZW50czogVFtdO1xuICBfbmV4dDogTm9kZTxUPiB8IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBTaW1wbGUgcXVldWUgc3RydWN0dXJlLlxuICpcbiAqIEF2b2lkcyBzY2FsYWJpbGl0eSBpc3N1ZXMgd2l0aCB1c2luZyBhIHBhY2tlZCBhcnJheSBkaXJlY3RseSBieSB1c2luZ1xuICogbXVsdGlwbGUgYXJyYXlzIGluIGEgbGlua2VkIGxpc3QgYW5kIGtlZXBpbmcgdGhlIGFycmF5IHNpemUgYm91bmRlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNpbXBsZVF1ZXVlPFQ+IHtcbiAgcHJpdmF0ZSBfZnJvbnQ6IE5vZGU8VD47XG4gIHByaXZhdGUgX2JhY2s6IE5vZGU8VD47XG4gIHByaXZhdGUgX2N1cnNvciA9IDA7XG4gIHByaXZhdGUgX3NpemUgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIF9mcm9udCBhbmQgX2JhY2sgYXJlIGFsd2F5cyBkZWZpbmVkLlxuICAgIHRoaXMuX2Zyb250ID0ge1xuICAgICAgX2VsZW1lbnRzOiBbXSxcbiAgICAgIF9uZXh0OiB1bmRlZmluZWRcbiAgICB9O1xuICAgIHRoaXMuX2JhY2sgPSB0aGlzLl9mcm9udDtcbiAgICAvLyBUaGUgY3Vyc29yIGlzIHVzZWQgdG8gYXZvaWQgY2FsbGluZyBBcnJheS5zaGlmdCgpLlxuICAgIC8vIEl0IGNvbnRhaW5zIHRoZSBpbmRleCBvZiB0aGUgZnJvbnQgZWxlbWVudCBvZiB0aGUgYXJyYXkgaW5zaWRlIHRoZVxuICAgIC8vIGZyb250LW1vc3Qgbm9kZS4gSXQgaXMgYWx3YXlzIGluIHRoZSByYW5nZSBbMCwgUVVFVUVfTUFYX0FSUkFZX1NJWkUpLlxuICAgIHRoaXMuX2N1cnNvciA9IDA7XG4gICAgLy8gV2hlbiB0aGVyZSBpcyBvbmx5IG9uZSBub2RlLCBzaXplID09PSBlbGVtZW50cy5sZW5ndGggLSBjdXJzb3IuXG4gICAgdGhpcy5fc2l6ZSA9IDA7XG4gIH1cblxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gIH1cblxuICAvLyBGb3IgZXhjZXB0aW9uIHNhZmV0eSwgdGhpcyBtZXRob2QgaXMgc3RydWN0dXJlZCBpbiBvcmRlcjpcbiAgLy8gMS4gUmVhZCBzdGF0ZVxuICAvLyAyLiBDYWxjdWxhdGUgcmVxdWlyZWQgc3RhdGUgbXV0YXRpb25zXG4gIC8vIDMuIFBlcmZvcm0gc3RhdGUgbXV0YXRpb25zXG4gIHB1c2goZWxlbWVudDogVCk6IHZvaWQge1xuICAgIGNvbnN0IG9sZEJhY2sgPSB0aGlzLl9iYWNrO1xuICAgIGxldCBuZXdCYWNrID0gb2xkQmFjaztcbiAgICBhc3NlcnQob2xkQmFjay5fbmV4dCA9PT0gdW5kZWZpbmVkKTtcbiAgICBpZiAob2xkQmFjay5fZWxlbWVudHMubGVuZ3RoID09PSBRVUVVRV9NQVhfQVJSQVlfU0laRSAtIDEpIHtcbiAgICAgIG5ld0JhY2sgPSB7XG4gICAgICAgIF9lbGVtZW50czogW10sXG4gICAgICAgIF9uZXh0OiB1bmRlZmluZWRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gcHVzaCgpIGlzIHRoZSBtdXRhdGlvbiBtb3N0IGxpa2VseSB0byB0aHJvdyBhbiBleGNlcHRpb24sIHNvIGl0XG4gICAgLy8gZ29lcyBmaXJzdC5cbiAgICBvbGRCYWNrLl9lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIGlmIChuZXdCYWNrICE9PSBvbGRCYWNrKSB7XG4gICAgICB0aGlzLl9iYWNrID0gbmV3QmFjaztcbiAgICAgIG9sZEJhY2suX25leHQgPSBuZXdCYWNrO1xuICAgIH1cbiAgICArK3RoaXMuX3NpemU7XG4gIH1cblxuICAvLyBMaWtlIHB1c2goKSwgc2hpZnQoKSBmb2xsb3dzIHRoZSByZWFkIC0+IGNhbGN1bGF0ZSAtPiBtdXRhdGUgcGF0dGVybiBmb3JcbiAgLy8gZXhjZXB0aW9uIHNhZmV0eS5cbiAgc2hpZnQoKTogVCB7XG4gICAgYXNzZXJ0KHRoaXMuX3NpemUgPiAwKTsgLy8gbXVzdCBub3QgYmUgY2FsbGVkIG9uIGFuIGVtcHR5IHF1ZXVlXG5cbiAgICBjb25zdCBvbGRGcm9udCA9IHRoaXMuX2Zyb250O1xuICAgIGxldCBuZXdGcm9udCA9IG9sZEZyb250O1xuICAgIGNvbnN0IG9sZEN1cnNvciA9IHRoaXMuX2N1cnNvcjtcbiAgICBsZXQgbmV3Q3Vyc29yID0gb2xkQ3Vyc29yICsgMTtcblxuICAgIGNvbnN0IGVsZW1lbnRzID0gb2xkRnJvbnQuX2VsZW1lbnRzO1xuICAgIGNvbnN0IGVsZW1lbnQgPSBlbGVtZW50c1tvbGRDdXJzb3JdO1xuXG4gICAgaWYgKG5ld0N1cnNvciA9PT0gUVVFVUVfTUFYX0FSUkFZX1NJWkUpIHtcbiAgICAgIGFzc2VydChlbGVtZW50cy5sZW5ndGggPT09IFFVRVVFX01BWF9BUlJBWV9TSVpFKTtcbiAgICAgIGFzc2VydChvbGRGcm9udC5fbmV4dCAhPT0gdW5kZWZpbmVkKTtcbiAgICAgIG5ld0Zyb250ID0gb2xkRnJvbnQuX25leHQhO1xuICAgICAgbmV3Q3Vyc29yID0gMDtcbiAgICB9XG5cbiAgICAvLyBObyBtdXRhdGlvbnMgYmVmb3JlIHRoaXMgcG9pbnQuXG4gICAgLS10aGlzLl9zaXplO1xuICAgIHRoaXMuX2N1cnNvciA9IG5ld0N1cnNvcjtcbiAgICBpZiAob2xkRnJvbnQgIT09IG5ld0Zyb250KSB7XG4gICAgICB0aGlzLl9mcm9udCA9IG5ld0Zyb250O1xuICAgIH1cblxuICAgIC8vIFBlcm1pdCBzaGlmdGVkIGVsZW1lbnQgdG8gYmUgZ2FyYmFnZSBjb2xsZWN0ZWQuXG4gICAgZWxlbWVudHNbb2xkQ3Vyc29yXSA9IHVuZGVmaW5lZCE7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIC8vIFRoZSB0cmlja3kgdGhpbmcgYWJvdXQgZm9yRWFjaCgpIGlzIHRoYXQgaXQgY2FuIGJlIGNhbGxlZFxuICAvLyByZS1lbnRyYW50bHkuIFRoZSBxdWV1ZSBtYXkgYmUgbXV0YXRlZCBpbnNpZGUgdGhlIGNhbGxiYWNrLiBJdCBpcyBlYXN5IHRvXG4gIC8vIHNlZSB0aGF0IHB1c2goKSB3aXRoaW4gdGhlIGNhbGxiYWNrIGhhcyBubyBuZWdhdGl2ZSBlZmZlY3RzIHNpbmNlIHRoZSBlbmRcbiAgLy8gb2YgdGhlIHF1ZXVlIGlzIGNoZWNrZWQgZm9yIG9uIGV2ZXJ5IGl0ZXJhdGlvbi4gSWYgc2hpZnQoKSBpcyBjYWxsZWRcbiAgLy8gcmVwZWF0ZWRseSB3aXRoaW4gdGhlIGNhbGxiYWNrIHRoZW4gdGhlIG5leHQgaXRlcmF0aW9uIG1heSByZXR1cm4gYW5cbiAgLy8gZWxlbWVudCB0aGF0IGhhcyBiZWVuIHJlbW92ZWQuIEluIHRoaXMgY2FzZSB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWRcbiAgLy8gd2l0aCB1bmRlZmluZWQgdmFsdWVzIHVudGlsIHdlIGVpdGhlciBcImNhdGNoIHVwXCIgd2l0aCBlbGVtZW50cyB0aGF0IHN0aWxsXG4gIC8vIGV4aXN0IG9yIHJlYWNoIHRoZSBiYWNrIG9mIHRoZSBxdWV1ZS5cbiAgZm9yRWFjaChjYWxsYmFjazogKGVsZW1lbnQ6IFQpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBsZXQgaSA9IHRoaXMuX2N1cnNvcjtcbiAgICBsZXQgbm9kZSA9IHRoaXMuX2Zyb250O1xuICAgIGxldCBlbGVtZW50cyA9IG5vZGUuX2VsZW1lbnRzO1xuICAgIHdoaWxlIChpICE9PSBlbGVtZW50cy5sZW5ndGggfHwgbm9kZS5fbmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaSA9PT0gZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGFzc2VydChub2RlLl9uZXh0ICE9PSB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQoaSA9PT0gUVVFVUVfTUFYX0FSUkFZX1NJWkUpO1xuICAgICAgICBub2RlID0gbm9kZS5fbmV4dCE7XG4gICAgICAgIGVsZW1lbnRzID0gbm9kZS5fZWxlbWVudHM7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBpZiAoZWxlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKGVsZW1lbnRzW2ldKTtcbiAgICAgICsraTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIGVsZW1lbnQgdGhhdCB3b3VsZCBiZSByZXR1cm5lZCBpZiBzaGlmdCgpIHdhcyBjYWxsZWQgbm93LFxuICAvLyB3aXRob3V0IG1vZGlmeWluZyB0aGUgcXVldWUuXG4gIHBlZWsoKTogVCB7XG4gICAgYXNzZXJ0KHRoaXMuX3NpemUgPiAwKTsgLy8gbXVzdCBub3QgYmUgY2FsbGVkIG9uIGFuIGVtcHR5IHF1ZXVlXG5cbiAgICBjb25zdCBmcm9udCA9IHRoaXMuX2Zyb250O1xuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuX2N1cnNvcjtcbiAgICByZXR1cm4gZnJvbnQuX2VsZW1lbnRzW2N1cnNvcl07XG4gIH1cbn1cbiIsICJleHBvcnQgY29uc3QgQWJvcnRTdGVwcyA9IFN5bWJvbCgnW1tBYm9ydFN0ZXBzXV0nKTtcbmV4cG9ydCBjb25zdCBFcnJvclN0ZXBzID0gU3ltYm9sKCdbW0Vycm9yU3RlcHNdXScpO1xuZXhwb3J0IGNvbnN0IENhbmNlbFN0ZXBzID0gU3ltYm9sKCdbW0NhbmNlbFN0ZXBzXV0nKTtcbmV4cG9ydCBjb25zdCBQdWxsU3RlcHMgPSBTeW1ib2woJ1tbUHVsbFN0ZXBzXV0nKTtcbmV4cG9ydCBjb25zdCBSZWxlYXNlU3RlcHMgPSBTeW1ib2woJ1tbUmVsZWFzZVN0ZXBzXV0nKTtcbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IFJlYWRhYmxlU3RyZWFtLCBSZWFkYWJsZVN0cmVhbUNhbmNlbCwgdHlwZSBSZWFkYWJsZVN0cmVhbVJlYWRlciB9IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBuZXdQcm9taXNlLCBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgUmVsZWFzZVN0ZXBzIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2ludGVybmFsLW1ldGhvZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljSW5pdGlhbGl6ZTxSPihyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPFI+LCBzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+KSB7XG4gIHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbSA9IHN0cmVhbTtcbiAgc3RyZWFtLl9yZWFkZXIgPSByZWFkZXI7XG5cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdyZWFkYWJsZScpIHtcbiAgICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUocmVhZGVyKTtcbiAgfSBlbHNlIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQocmVhZGVyKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yZWQnKTtcblxuICAgIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQocmVhZGVyLCBzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfVxufVxuXG4vLyBBIGNsaWVudCBvZiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIgYW5kIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlciBtYXkgdXNlIHRoZXNlIGZ1bmN0aW9ucyBkaXJlY3RseSB0byBieXBhc3Mgc3RhdGVcbi8vIGNoZWNrLlxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljQ2FuY2VsKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55PiwgcmVhc29uOiBhbnkpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBjb25zdCBzdHJlYW0gPSByZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW07XG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG4gIHJldHVybiBSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIHJlYXNvbik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55Pikge1xuICBjb25zdCBzdHJlYW0gPSByZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW07XG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChzdHJlYW0uX3JlYWRlciA9PT0gcmVhZGVyKTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJykge1xuICAgIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVqZWN0KFxuICAgICAgcmVhZGVyLFxuICAgICAgbmV3IFR5cGVFcnJvcihgUmVhZGVyIHdhcyByZWxlYXNlZCBhbmQgY2FuIG5vIGxvbmdlciBiZSB1c2VkIHRvIG1vbml0b3IgdGhlIHN0cmVhbSdzIGNsb3NlZG5lc3NgKSk7XG4gIH0gZWxzZSB7XG4gICAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZXNldFRvUmVqZWN0ZWQoXG4gICAgICByZWFkZXIsXG4gICAgICBuZXcgVHlwZUVycm9yKGBSZWFkZXIgd2FzIHJlbGVhc2VkIGFuZCBjYW4gbm8gbG9uZ2VyIGJlIHVzZWQgdG8gbW9uaXRvciB0aGUgc3RyZWFtJ3MgY2xvc2VkbmVzc2ApKTtcbiAgfVxuXG4gIHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyW1JlbGVhc2VTdGVwc10oKTtcblxuICBzdHJlYW0uX3JlYWRlciA9IHVuZGVmaW5lZDtcbiAgcmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtID0gdW5kZWZpbmVkITtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIHJlYWRlcnMuXG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkZXJMb2NrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdDYW5ub3QgJyArIG5hbWUgKyAnIGEgc3RyZWFtIHVzaW5nIGEgcmVsZWFzZWQgcmVhZGVyJyk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIuXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+KSB7XG4gIHJlYWRlci5fY2xvc2VkUHJvbWlzZSA9IG5ld1Byb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+LCByZWFzb246IGFueSkge1xuICBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUocmVhZGVyKTtcbiAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZWplY3QocmVhZGVyLCByZWFzb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZXNvbHZlZChyZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPGFueT4pIHtcbiAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHJlYWRlcik7XG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlUmVzb2x2ZShyZWFkZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZWplY3QocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+LCByZWFzb246IGFueSkge1xuICBpZiAocmVhZGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZShyZWFkZXIuX2Nsb3NlZFByb21pc2UpO1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0KHJlYXNvbik7XG4gIHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZXNldFRvUmVqZWN0ZWQocmVhZGVyOiBSZWFkYWJsZVN0cmVhbVJlYWRlcjxhbnk+LCByZWFzb246IGFueSkge1xuICBhc3NlcnQocmVhZGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChyZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpO1xuXG4gIGRlZmF1bHRSZWFkZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQocmVhZGVyLCByZWFzb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZXNvbHZlKHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8YW55Pikge1xuICBpZiAocmVhZGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlKHVuZGVmaW5lZCk7XG4gIHJlYWRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICByZWFkZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xufVxuIiwgIi8vLyA8cmVmZXJlbmNlIGxpYj1cImVzMjAxNS5jb3JlXCIgLz5cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL2lzRmluaXRlI1BvbHlmaWxsXG5jb25zdCBOdW1iZXJJc0Zpbml0ZTogdHlwZW9mIE51bWJlci5pc0Zpbml0ZSA9IE51bWJlci5pc0Zpbml0ZSB8fCBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdudW1iZXInICYmIGlzRmluaXRlKHgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTnVtYmVySXNGaW5pdGU7XG4iLCAiLy8vIDxyZWZlcmVuY2UgbGliPVwiZXMyMDE1LmNvcmVcIiAvPlxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXRoL3RydW5jI1BvbHlmaWxsXG5jb25zdCBNYXRoVHJ1bmM6IHR5cGVvZiBNYXRoLnRydW5jID0gTWF0aC50cnVuYyB8fCBmdW5jdGlvbiAodikge1xuICByZXR1cm4gdiA8IDAgPyBNYXRoLmNlaWwodikgOiBNYXRoLmZsb29yKHYpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTWF0aFRydW5jO1xuIiwgImltcG9ydCBOdW1iZXJJc0Zpbml0ZSBmcm9tICcuLi8uLi9zdHViL251bWJlci1pc2Zpbml0ZSc7XG5pbXBvcnQgTWF0aFRydW5jIGZyb20gJy4uLy4uL3N0dWIvbWF0aC10cnVuYyc7XG5cbi8vIGh0dHBzOi8vaGV5Y2FtLmdpdGh1Yi5pby93ZWJpZGwvI2lkbC1kaWN0aW9uYXJpZXNcbmV4cG9ydCBmdW5jdGlvbiBpc0RpY3Rpb25hcnkoeDogYW55KTogeCBpcyBvYmplY3QgfCBudWxsIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydERpY3Rpb25hcnkob2JqOiB1bmtub3duLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyBvYmogaXMgb2JqZWN0IHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gIGlmIChvYmogIT09IHVuZGVmaW5lZCAmJiAhaXNEaWN0aW9uYXJ5KG9iaikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhbiBvYmplY3QuYCk7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgQW55RnVuY3Rpb24gPSAoLi4uYXJnczogYW55W10pID0+IGFueTtcblxuLy8gaHR0cHM6Ly9oZXljYW0uZ2l0aHViLmlvL3dlYmlkbC8jaWRsLWNhbGxiYWNrLWZ1bmN0aW9uc1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEZ1bmN0aW9uKHg6IHVua25vd24sIGNvbnRleHQ6IHN0cmluZyk6IGFzc2VydHMgeCBpcyBBbnlGdW5jdGlvbiB7XG4gIGlmICh0eXBlb2YgeCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGEgZnVuY3Rpb24uYCk7XG4gIH1cbn1cblxuLy8gaHR0cHM6Ly9oZXljYW0uZ2l0aHViLmlvL3dlYmlkbC8jaWRsLW9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHg6IGFueSk6IHggaXMgb2JqZWN0IHtcbiAgcmV0dXJuICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCkgfHwgdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRPYmplY3QoeDogdW5rbm93bixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyB4IGlzIG9iamVjdCB7XG4gIGlmICghaXNPYmplY3QoeCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhbiBvYmplY3QuYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFJlcXVpcmVkQXJndW1lbnQ8VD4oeDogVCB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIHggaXMgVCB7XG4gIGlmICh4ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBQYXJhbWV0ZXIgJHtwb3NpdGlvbn0gaXMgcmVxdWlyZWQgaW4gJyR7Y29udGV4dH0nLmApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRSZXF1aXJlZEZpZWxkPFQ+KHg6IFQgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyB4IGlzIFQge1xuICBpZiAoeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtmaWVsZH0gaXMgcmVxdWlyZWQgaW4gJyR7Y29udGV4dH0nLmApO1xuICB9XG59XG5cbi8vIGh0dHBzOi8vaGV5Y2FtLmdpdGh1Yi5pby93ZWJpZGwvI2lkbC11bnJlc3RyaWN0ZWQtZG91YmxlXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFVucmVzdHJpY3RlZERvdWJsZSh2YWx1ZTogdW5rbm93bik6IG51bWJlciB7XG4gIHJldHVybiBOdW1iZXIodmFsdWUpO1xufVxuXG5mdW5jdGlvbiBjZW5zb3JOZWdhdGl2ZVplcm8oeDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIHggPT09IDAgPyAwIDogeDtcbn1cblxuZnVuY3Rpb24gaW50ZWdlclBhcnQoeDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGNlbnNvck5lZ2F0aXZlWmVybyhNYXRoVHJ1bmMoeCkpO1xufVxuXG4vLyBodHRwczovL2hleWNhbS5naXRodWIuaW8vd2ViaWRsLyNpZGwtdW5zaWduZWQtbG9uZy1sb25nXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlKHZhbHVlOiB1bmtub3duLCBjb250ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBsb3dlckJvdW5kID0gMDtcbiAgY29uc3QgdXBwZXJCb3VuZCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG4gIGxldCB4ID0gTnVtYmVyKHZhbHVlKTtcbiAgeCA9IGNlbnNvck5lZ2F0aXZlWmVybyh4KTtcblxuICBpZiAoIU51bWJlcklzRmluaXRlKHgpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYSBmaW5pdGUgbnVtYmVyYCk7XG4gIH1cblxuICB4ID0gaW50ZWdlclBhcnQoeCk7XG5cbiAgaWYgKHggPCBsb3dlckJvdW5kIHx8IHggPiB1cHBlckJvdW5kKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBvdXRzaWRlIHRoZSBhY2NlcHRlZCByYW5nZSBvZiAke2xvd2VyQm91bmR9IHRvICR7dXBwZXJCb3VuZH0sIGluY2x1c2l2ZWApO1xuICB9XG5cbiAgaWYgKCFOdW1iZXJJc0Zpbml0ZSh4KSB8fCB4ID09PSAwKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvLyBUT0RPIFVzZSBCaWdJbnQgaWYgc3VwcG9ydGVkP1xuICAvLyBsZXQgeEJpZ0ludCA9IEJpZ0ludChpbnRlZ2VyUGFydCh4KSk7XG4gIC8vIHhCaWdJbnQgPSBCaWdJbnQuYXNVaW50Tig2NCwgeEJpZ0ludCk7XG4gIC8vIHJldHVybiBOdW1iZXIoeEJpZ0ludCk7XG5cbiAgcmV0dXJuIHg7XG59XG4iLCAiaW1wb3J0IHsgSXNSZWFkYWJsZVN0cmVhbSwgUmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0UmVhZGFibGVTdHJlYW0oeDogdW5rbm93biwgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyB4IGlzIFJlYWRhYmxlU3RyZWFtIHtcbiAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtKHgpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSBpcyBub3QgYSBSZWFkYWJsZVN0cmVhbS5gKTtcbiAgfVxufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgU2ltcGxlUXVldWUgfSBmcm9tICcuLi9zaW1wbGUtcXVldWUnO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljQ2FuY2VsLFxuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNJbml0aWFsaXplLFxuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlLFxuICByZWFkZXJMb2NrRXhjZXB0aW9uXG59IGZyb20gJy4vZ2VuZXJpYy1yZWFkZXInO1xuaW1wb3J0IHsgSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCwgUmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgUHVsbFN0ZXBzIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2ludGVybmFsLW1ldGhvZHMnO1xuaW1wb3J0IHsgbmV3UHJvbWlzZSwgcHJvbWlzZVJlamVjdGVkV2l0aCB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IGFzc2VydFJlcXVpcmVkQXJndW1lbnQgfSBmcm9tICcuLi92YWxpZGF0b3JzL2Jhc2ljJztcbmltcG9ydCB7IGFzc2VydFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9yZWFkYWJsZS1zdHJlYW0nO1xuXG4vKipcbiAqIEEgcmVzdWx0IHJldHVybmVkIGJ5IHtAbGluayBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucmVhZH0uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgdHlwZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFQ+ID0ge1xuICBkb25lOiBmYWxzZTtcbiAgdmFsdWU6IFQ7XG59IHwge1xuICBkb25lOiB0cnVlO1xuICB2YWx1ZT86IHVuZGVmaW5lZDtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtLlxuXG5leHBvcnQgZnVuY3Rpb24gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtKTogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+IHtcbiAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIoc3RyZWFtKTtcbn1cblxuLy8gUmVhZGFibGVTdHJlYW0gQVBJIGV4cG9zZWQgZm9yIGNvbnRyb2xsZXJzLlxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1BZGRSZWFkUmVxdWVzdDxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PFI+KTogdm9pZCB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcihzdHJlYW0uX3JlYWRlcikpO1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG5cbiAgKHN0cmVhbS5fcmVhZGVyISBhcyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4pLl9yZWFkUmVxdWVzdHMucHVzaChyZWFkUmVxdWVzdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkUmVxdWVzdDxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+LCBjaHVuazogUiB8IHVuZGVmaW5lZCwgZG9uZTogYm9vbGVhbikge1xuICBjb25zdCByZWFkZXIgPSBzdHJlYW0uX3JlYWRlciBhcyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj47XG5cbiAgYXNzZXJ0KHJlYWRlci5fcmVhZFJlcXVlc3RzLmxlbmd0aCA+IDApO1xuXG4gIGNvbnN0IHJlYWRSZXF1ZXN0ID0gcmVhZGVyLl9yZWFkUmVxdWVzdHMuc2hpZnQoKSE7XG4gIGlmIChkb25lKSB7XG4gICAgcmVhZFJlcXVlc3QuX2Nsb3NlU3RlcHMoKTtcbiAgfSBlbHNlIHtcbiAgICByZWFkUmVxdWVzdC5fY2h1bmtTdGVwcyhjaHVuayEpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0czxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+KTogbnVtYmVyIHtcbiAgcmV0dXJuIChzdHJlYW0uX3JlYWRlciBhcyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4pLl9yZWFkUmVxdWVzdHMubGVuZ3RoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1IYXNEZWZhdWx0UmVhZGVyKHN0cmVhbTogUmVhZGFibGVTdHJlYW0pOiBib29sZWFuIHtcbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLl9yZWFkZXI7XG5cbiAgaWYgKHJlYWRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcihyZWFkZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFJlYWRlcnNcblxuZXhwb3J0IGludGVyZmFjZSBSZWFkUmVxdWVzdDxSPiB7XG4gIF9jaHVua1N0ZXBzKGNodW5rOiBSKTogdm9pZDtcblxuICBfY2xvc2VTdGVwcygpOiB2b2lkO1xuXG4gIF9lcnJvclN0ZXBzKGU6IGFueSk6IHZvaWQ7XG59XG5cbi8qKlxuICogQSBkZWZhdWx0IHJlYWRlciB2ZW5kZWQgYnkgYSB7QGxpbmsgUmVhZGFibGVTdHJlYW19LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSID0gYW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX293bmVyUmVhZGFibGVTdHJlYW0hOiBSZWFkYWJsZVN0cmVhbTxSPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZSE6IFByb21pc2U8dW5kZWZpbmVkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZV9yZXNvbHZlPzogKHZhbHVlPzogdW5kZWZpbmVkKSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlX3JlamVjdD86IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZFJlcXVlc3RzOiBTaW1wbGVRdWV1ZTxSZWFkUmVxdWVzdDxSPj47XG5cbiAgY29uc3RydWN0b3Ioc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPikge1xuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQoc3RyZWFtLCAxLCAnUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyJyk7XG4gICAgYXNzZXJ0UmVhZGFibGVTdHJlYW0oc3RyZWFtLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbUxvY2tlZChzdHJlYW0pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGlzIHN0cmVhbSBoYXMgYWxyZWFkeSBiZWVuIGxvY2tlZCBmb3IgZXhjbHVzaXZlIHJlYWRpbmcgYnkgYW5vdGhlciByZWFkZXInKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNJbml0aWFsaXplKHRoaXMsIHN0cmVhbSk7XG5cbiAgICB0aGlzLl9yZWFkUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIHdoZW4gdGhlIHN0cmVhbSBiZWNvbWVzIGNsb3NlZCxcbiAgICogb3IgcmVqZWN0ZWQgaWYgdGhlIHN0cmVhbSBldmVyIGVycm9ycyBvciB0aGUgcmVhZGVyJ3MgbG9jayBpcyByZWxlYXNlZCBiZWZvcmUgdGhlIHN0cmVhbSBmaW5pc2hlcyBjbG9zaW5nLlxuICAgKi9cbiAgZ2V0IGNsb3NlZCgpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjbG9zZWQnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Nsb3NlZFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIHJlYWRlciBpcyBhY3RpdmUsIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIFJlYWRhYmxlU3RyZWFtLmNhbmNlbCB8IHN0cmVhbS5jYW5jZWwocmVhc29uKX0uXG4gICAqL1xuICBjYW5jZWwocmVhc29uOiBhbnkgPSB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0UmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2FuY2VsJykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lclJlYWRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHJlYWRlckxvY2tFeGNlcHRpb24oJ2NhbmNlbCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljQ2FuY2VsKHRoaXMsIHJlYXNvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCBhbGxvd3MgYWNjZXNzIHRvIHRoZSBuZXh0IGNodW5rIGZyb20gdGhlIHN0cmVhbSdzIGludGVybmFsIHF1ZXVlLCBpZiBhdmFpbGFibGUuXG4gICAqXG4gICAqIElmIHJlYWRpbmcgYSBjaHVuayBjYXVzZXMgdGhlIHF1ZXVlIHRvIGJlY29tZSBlbXB0eSwgbW9yZSBkYXRhIHdpbGwgYmUgcHVsbGVkIGZyb20gdGhlIHVuZGVybHlpbmcgc291cmNlLlxuICAgKi9cbiAgcmVhZCgpOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0UmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbigncmVhZCcpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJSZWFkYWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChyZWFkZXJMb2NrRXhjZXB0aW9uKCdyZWFkIGZyb20nKSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc29sdmVQcm9taXNlITogKHJlc3VsdDogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPikgPT4gdm9pZDtcbiAgICBsZXQgcmVqZWN0UHJvbWlzZSE6IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmU7XG4gICAgICByZWplY3RQcm9taXNlID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIGNvbnN0IHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxSPiA9IHtcbiAgICAgIF9jaHVua1N0ZXBzOiBjaHVuayA9PiByZXNvbHZlUHJvbWlzZSh7IHZhbHVlOiBjaHVuaywgZG9uZTogZmFsc2UgfSksXG4gICAgICBfY2xvc2VTdGVwczogKCkgPT4gcmVzb2x2ZVByb21pc2UoeyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH0pLFxuICAgICAgX2Vycm9yU3RlcHM6IGUgPT4gcmVqZWN0UHJvbWlzZShlKVxuICAgIH07XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZCh0aGlzLCByZWFkUmVxdWVzdCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZXMgdGhlIHJlYWRlcidzIGxvY2sgb24gdGhlIGNvcnJlc3BvbmRpbmcgc3RyZWFtLiBBZnRlciB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHJlYWRlciBpcyBubyBsb25nZXIgYWN0aXZlLlxuICAgKiBJZiB0aGUgYXNzb2NpYXRlZCBzdHJlYW0gaXMgZXJyb3JlZCB3aGVuIHRoZSBsb2NrIGlzIHJlbGVhc2VkLCB0aGUgcmVhZGVyIHdpbGwgYXBwZWFyIGVycm9yZWQgaW4gdGhlIHNhbWUgd2F5XG4gICAqIGZyb20gbm93IG9uOyBvdGhlcndpc2UsIHRoZSByZWFkZXIgd2lsbCBhcHBlYXIgY2xvc2VkLlxuICAgKlxuICAgKiBBIHJlYWRlcidzIGxvY2sgY2Fubm90IGJlIHJlbGVhc2VkIHdoaWxlIGl0IHN0aWxsIGhhcyBhIHBlbmRpbmcgcmVhZCByZXF1ZXN0LCBpLmUuLCBpZiBhIHByb21pc2UgcmV0dXJuZWQgYnlcbiAgICogdGhlIHJlYWRlcidzIHtAbGluayBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucmVhZCB8IHJlYWQoKX0gbWV0aG9kIGhhcyBub3QgeWV0IGJlZW4gc2V0dGxlZC4gQXR0ZW1wdGluZyB0b1xuICAgKiBkbyBzbyB3aWxsIHRocm93IGEgYFR5cGVFcnJvcmAgYW5kIGxlYXZlIHRoZSByZWFkZXIgbG9ja2VkIHRvIHRoZSBzdHJlYW0uXG4gICAqL1xuICByZWxlYXNlTG9jaygpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0UmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbigncmVsZWFzZUxvY2snKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJSZWFkYWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVsZWFzZSh0aGlzKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucHJvdG90eXBlLCB7XG4gIGNhbmNlbDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlYWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZWxlYXNlTG9jazogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGNsb3NlZDogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5wcm90b3R5cGUuY2FuY2VsLCAnY2FuY2VsJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLnByb3RvdHlwZS5yZWFkLCAncmVhZCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlci5wcm90b3R5cGUucmVsZWFzZUxvY2ssICdyZWxlYXNlTG9jaycpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcicsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgcmVhZGVycy5cblxuZXhwb3J0IGZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFIgPSBhbnk+KHg6IGFueSk6IHggaXMgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX3JlYWRSZXF1ZXN0cycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkPFI+KHJlYWRlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PFI+KTogdm9pZCB7XG4gIGNvbnN0IHN0cmVhbSA9IHJlYWRlci5fb3duZXJSZWFkYWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIHN0cmVhbS5fZGlzdHVyYmVkID0gdHJ1ZTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZWFkUmVxdWVzdC5fY2xvc2VTdGVwcygpO1xuICB9IGVsc2UgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJlYWRSZXF1ZXN0Ll9lcnJvclN0ZXBzKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnKTtcbiAgICBzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcltQdWxsU3RlcHNdKHJlYWRSZXF1ZXN0IGFzIFJlYWRSZXF1ZXN0PGFueT4pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWxlYXNlKHJlYWRlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKSB7XG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcbiAgY29uc3QgZSA9IG5ldyBUeXBlRXJyb3IoJ1JlYWRlciB3YXMgcmVsZWFzZWQnKTtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyRXJyb3JSZWFkUmVxdWVzdHMocmVhZGVyLCBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckVycm9yUmVhZFJlcXVlc3RzKHJlYWRlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLCBlOiBhbnkpIHtcbiAgY29uc3QgcmVhZFJlcXVlc3RzID0gcmVhZGVyLl9yZWFkUmVxdWVzdHM7XG4gIHJlYWRlci5fcmVhZFJlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gIHJlYWRSZXF1ZXN0cy5mb3JFYWNoKHJlYWRSZXF1ZXN0ID0+IHtcbiAgICByZWFkUmVxdWVzdC5fZXJyb3JTdGVwcyhlKTtcbiAgfSk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIuXG5cbmZ1bmN0aW9uIGRlZmF1bHRSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcmApO1xufVxuIiwgIi8vLyA8cmVmZXJlbmNlIGxpYj1cImVzMjAxOC5hc3luY2l0ZXJhYmxlXCIgLz5cblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uICovXG5leHBvcnQgY29uc3QgQXN5bmNJdGVyYXRvclByb3RvdHlwZTogQXN5bmNJdGVyYWJsZTxhbnk+ID1cbiAgT2JqZWN0LmdldFByb3RvdHlwZU9mKE9iamVjdC5nZXRQcm90b3R5cGVPZihhc3luYyBmdW5jdGlvbiogKCk6IEFzeW5jSXRlcmFibGVJdGVyYXRvcjxhbnk+IHt9KS5wcm90b3R5cGUpO1xuIiwgIi8vLyA8cmVmZXJlbmNlIGxpYj1cImVzMjAxOC5hc3luY2l0ZXJhYmxlXCIgLz5cblxuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHtcbiAgQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQsXG4gIHR5cGUgUmVhZFJlcXVlc3Rcbn0gZnJvbSAnLi9kZWZhdWx0LXJlYWRlcic7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNDYW5jZWwsIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UgfSBmcm9tICcuL2dlbmVyaWMtcmVhZGVyJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgQXN5bmNJdGVyYXRvclByb3RvdHlwZSB9IGZyb20gJ0BAdGFyZ2V0L3N0dWIvYXN5bmMtaXRlcmF0b3ItcHJvdG90eXBlJztcbmltcG9ydCB7IHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQge1xuICBuZXdQcm9taXNlLFxuICBwcm9taXNlUmVqZWN0ZWRXaXRoLFxuICBwcm9taXNlUmVzb2x2ZWRXaXRoLFxuICBxdWV1ZU1pY3JvdGFzayxcbiAgdHJhbnNmb3JtUHJvbWlzZVdpdGhcbn0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuXG4vKipcbiAqIEFuIGFzeW5jIGl0ZXJhdG9yIHJldHVybmVkIGJ5IHtAbGluayBSZWFkYWJsZVN0cmVhbS52YWx1ZXN9LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4gZXh0ZW5kcyBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8Uj4ge1xuICBuZXh0KCk6IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8UiwgdW5kZWZpbmVkPj47XG5cbiAgcmV0dXJuKHZhbHVlPzogYW55KTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxhbnk+Pjtcbn1cblxuZXhwb3J0IGNsYXNzIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckltcGw8Uj4ge1xuICBwcml2YXRlIHJlYWRvbmx5IF9yZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPjtcbiAgcHJpdmF0ZSByZWFkb25seSBfcHJldmVudENhbmNlbDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfb25nb2luZ1Byb21pc2U6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxSPj4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIHByaXZhdGUgX2lzRmluaXNoZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihyZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPiwgcHJldmVudENhbmNlbDogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlYWRlciA9IHJlYWRlcjtcbiAgICB0aGlzLl9wcmV2ZW50Q2FuY2VsID0gcHJldmVudENhbmNlbDtcbiAgfVxuXG4gIG5leHQoKTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PiB7XG4gICAgY29uc3QgbmV4dFN0ZXBzID0gKCkgPT4gdGhpcy5fbmV4dFN0ZXBzKCk7XG4gICAgdGhpcy5fb25nb2luZ1Byb21pc2UgPSB0aGlzLl9vbmdvaW5nUHJvbWlzZSA/XG4gICAgICB0cmFuc2Zvcm1Qcm9taXNlV2l0aCh0aGlzLl9vbmdvaW5nUHJvbWlzZSwgbmV4dFN0ZXBzLCBuZXh0U3RlcHMpIDpcbiAgICAgIG5leHRTdGVwcygpO1xuICAgIHJldHVybiB0aGlzLl9vbmdvaW5nUHJvbWlzZTtcbiAgfVxuXG4gIHJldHVybih2YWx1ZTogYW55KTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PGFueT4+IHtcbiAgICBjb25zdCByZXR1cm5TdGVwcyA9ICgpID0+IHRoaXMuX3JldHVyblN0ZXBzKHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5fb25nb2luZ1Byb21pc2UgP1xuICAgICAgdHJhbnNmb3JtUHJvbWlzZVdpdGgodGhpcy5fb25nb2luZ1Byb21pc2UsIHJldHVyblN0ZXBzLCByZXR1cm5TdGVwcykgOlxuICAgICAgcmV0dXJuU3RlcHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX25leHRTdGVwcygpOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4+IHtcbiAgICBpZiAodGhpcy5faXNGaW5pc2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVhZGVyID0gdGhpcy5fcmVhZGVyO1xuICAgIGFzc2VydChyZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW0gIT09IHVuZGVmaW5lZCk7XG5cbiAgICBsZXQgcmVzb2x2ZVByb21pc2UhOiAocmVzdWx0OiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+KSA9PiB2b2lkO1xuICAgIGxldCByZWplY3RQcm9taXNlITogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXdQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8Uj4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICAgIHJlamVjdFByb21pc2UgPSByZWplY3Q7XG4gICAgfSk7XG4gICAgY29uc3QgcmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PFI+ID0ge1xuICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHtcbiAgICAgICAgdGhpcy5fb25nb2luZ1Byb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIFRoaXMgbmVlZHMgdG8gYmUgZGVsYXllZCBieSBvbmUgbWljcm90YXNrLCBvdGhlcndpc2Ugd2Ugc3RvcCBwdWxsaW5nIHRvbyBlYXJseSB3aGljaCBicmVha3MgYSB0ZXN0LlxuICAgICAgICAvLyBGSVhNRSBJcyB0aGlzIGEgYnVnIGluIHRoZSBzcGVjaWZpY2F0aW9uLCBvciBpbiB0aGUgdGVzdD9cbiAgICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4gcmVzb2x2ZVByb21pc2UoeyB2YWx1ZTogY2h1bmssIGRvbmU6IGZhbHNlIH0pKTtcbiAgICAgIH0sXG4gICAgICBfY2xvc2VTdGVwczogKCkgPT4ge1xuICAgICAgICB0aGlzLl9vbmdvaW5nUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5faXNGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UoeyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH0pO1xuICAgICAgfSxcbiAgICAgIF9lcnJvclN0ZXBzOiByZWFzb24gPT4ge1xuICAgICAgICB0aGlzLl9vbmdvaW5nUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5faXNGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcbiAgICAgICAgcmVqZWN0UHJvbWlzZShyZWFzb24pO1xuICAgICAgfVxuICAgIH07XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZChyZWFkZXIsIHJlYWRSZXF1ZXN0KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHByaXZhdGUgX3JldHVyblN0ZXBzKHZhbHVlOiBhbnkpOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8YW55Pj4ge1xuICAgIGlmICh0aGlzLl9pc0ZpbmlzaGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgdmFsdWUsIGRvbmU6IHRydWUgfSk7XG4gICAgfVxuICAgIHRoaXMuX2lzRmluaXNoZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgcmVhZGVyID0gdGhpcy5fcmVhZGVyO1xuICAgIGFzc2VydChyZWFkZXIuX293bmVyUmVhZGFibGVTdHJlYW0gIT09IHVuZGVmaW5lZCk7XG4gICAgYXNzZXJ0KHJlYWRlci5fcmVhZFJlcXVlc3RzLmxlbmd0aCA9PT0gMCk7XG5cbiAgICBpZiAoIXRoaXMuX3ByZXZlbnRDYW5jZWwpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbChyZWFkZXIsIHZhbHVlKTtcbiAgICAgIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aChyZXN1bHQsICgpID0+ICh7IHZhbHVlLCBkb25lOiB0cnVlIH0pKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgoeyB2YWx1ZSwgZG9uZTogdHJ1ZSB9KTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW5zdGFuY2U8Uj4gZXh0ZW5kcyBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3I8Uj4ge1xuICAvKiogQGludGVyYWwgKi9cbiAgX2FzeW5jSXRlcmF0b3JJbXBsOiBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JJbXBsPFI+O1xuXG4gIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxSLCB1bmRlZmluZWQ+PjtcblxuICByZXR1cm4odmFsdWU/OiBhbnkpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PGFueT4+O1xufVxuXG5jb25zdCBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JQcm90b3R5cGU6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPGFueT4gPSB7XG4gIG5leHQodGhpczogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW5zdGFuY2U8YW55Pik6IFByb21pc2U8UmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdDxhbnk+PiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtQXN5bmNJdGVyYXRvckJyYW5kQ2hlY2tFeGNlcHRpb24oJ25leHQnKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hc3luY0l0ZXJhdG9ySW1wbC5uZXh0KCk7XG4gIH0sXG5cbiAgcmV0dXJuKHRoaXM6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPGFueT4sIHZhbHVlOiBhbnkpOiBQcm9taXNlPFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQ8YW55Pj4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbUFzeW5jSXRlcmF0b3JCcmFuZENoZWNrRXhjZXB0aW9uKCdyZXR1cm4nKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9hc3luY0l0ZXJhdG9ySW1wbC5yZXR1cm4odmFsdWUpO1xuICB9XG59IGFzIGFueTtcbk9iamVjdC5zZXRQcm90b3R5cGVPZihSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JQcm90b3R5cGUsIEFzeW5jSXRlcmF0b3JQcm90b3R5cGUpO1xuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW0uXG5cbmV4cG9ydCBmdW5jdGlvbiBBY3F1aXJlUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50Q2FuY2VsOiBib29sZWFuKTogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+IHtcbiAgY29uc3QgcmVhZGVyID0gQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxSPihzdHJlYW0pO1xuICBjb25zdCBpbXBsID0gbmV3IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckltcGwocmVhZGVyLCBwcmV2ZW50Q2FuY2VsKTtcbiAgY29uc3QgaXRlcmF0b3I6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckluc3RhbmNlPFI+ID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3JQcm90b3R5cGUpO1xuICBpdGVyYXRvci5fYXN5bmNJdGVyYXRvckltcGwgPSBpbXBsO1xuICByZXR1cm4gaXRlcmF0b3I7XG59XG5cbmZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFIgPSBhbnk+KHg6IGFueSk6IHggaXMgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2FzeW5jSXRlcmF0b3JJbXBsJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIG5vaW5zcGVjdGlvbiBTdXNwaWNpb3VzVHlwZU9mR3VhcmRcbiAgICByZXR1cm4gKHggYXMgUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9ySW5zdGFuY2U8YW55PikuX2FzeW5jSXRlcmF0b3JJbXBsIGluc3RhbmNlb2ZcbiAgICAgIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvckltcGw7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW0uXG5cbmZ1bmN0aW9uIHN0cmVhbUFzeW5jSXRlcmF0b3JCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKGBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVTdGVhbUFzeW5jSXRlcmF0b3JgKTtcbn1cbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJlczIwMTUuY29yZVwiIC8+XG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9pc05hTiNQb2x5ZmlsbFxuY29uc3QgTnVtYmVySXNOYU46IHR5cGVvZiBOdW1iZXIuaXNOYU4gPSBOdW1iZXIuaXNOYU4gfHwgZnVuY3Rpb24gKHgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICByZXR1cm4geCAhPT0geDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE51bWJlcklzTmFOO1xuIiwgImltcG9ydCB7IHJlZmxlY3RDYWxsIH0gZnJvbSAnbGliL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgQXJyYXlCdWZmZXIge1xuICAgIHJlYWRvbmx5IGRldGFjaGVkOiBib29sZWFuO1xuXG4gICAgdHJhbnNmZXIoKTogQXJyYXlCdWZmZXI7XG4gIH1cblxuICBmdW5jdGlvbiBzdHJ1Y3R1cmVkQ2xvbmU8VD4odmFsdWU6IFQsIG9wdGlvbnM6IHsgdHJhbnNmZXI6IEFycmF5QnVmZmVyW10gfSk6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVBcnJheUZyb21MaXN0PFQgZXh0ZW5kcyBhbnlbXT4oZWxlbWVudHM6IFQpOiBUIHtcbiAgLy8gV2UgdXNlIGFycmF5cyB0byByZXByZXNlbnQgbGlzdHMsIHNvIHRoaXMgaXMgYmFzaWNhbGx5IGEgbm8tb3AuXG4gIC8vIERvIGEgc2xpY2UgdGhvdWdoIGp1c3QgaW4gY2FzZSB3ZSBoYXBwZW4gdG8gZGVwZW5kIG9uIHRoZSB1bmlxdWUtbmVzcy5cbiAgcmV0dXJuIGVsZW1lbnRzLnNsaWNlKCkgYXMgVDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENvcHlEYXRhQmxvY2tCeXRlcyhkZXN0OiBBcnJheUJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdE9mZnNldDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM6IEFycmF5QnVmZmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNPZmZzZXQ6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbjogbnVtYmVyKSB7XG4gIG5ldyBVaW50OEFycmF5KGRlc3QpLnNldChuZXcgVWludDhBcnJheShzcmMsIHNyY09mZnNldCwgbiksIGRlc3RPZmZzZXQpO1xufVxuXG5leHBvcnQgbGV0IFRyYW5zZmVyQXJyYXlCdWZmZXIgPSAoTzogQXJyYXlCdWZmZXIpOiBBcnJheUJ1ZmZlciA9PiB7XG4gIGlmICh0eXBlb2YgTy50cmFuc2ZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFRyYW5zZmVyQXJyYXlCdWZmZXIgPSBidWZmZXIgPT4gYnVmZmVyLnRyYW5zZmVyKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHN0cnVjdHVyZWRDbG9uZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFRyYW5zZmVyQXJyYXlCdWZmZXIgPSBidWZmZXIgPT4gc3RydWN0dXJlZENsb25lKGJ1ZmZlciwgeyB0cmFuc2ZlcjogW2J1ZmZlcl0gfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTm90IGltcGxlbWVudGVkIGNvcnJlY3RseVxuICAgIFRyYW5zZmVyQXJyYXlCdWZmZXIgPSBidWZmZXIgPT4gYnVmZmVyO1xuICB9XG4gIHJldHVybiBUcmFuc2ZlckFycmF5QnVmZmVyKE8pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIENhblRyYW5zZmVyQXJyYXlCdWZmZXIoTzogQXJyYXlCdWZmZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuICFJc0RldGFjaGVkQnVmZmVyKE8pO1xufVxuXG5leHBvcnQgbGV0IElzRGV0YWNoZWRCdWZmZXIgPSAoTzogQXJyYXlCdWZmZXIpOiBib29sZWFuID0+IHtcbiAgaWYgKHR5cGVvZiBPLmRldGFjaGVkID09PSAnYm9vbGVhbicpIHtcbiAgICBJc0RldGFjaGVkQnVmZmVyID0gYnVmZmVyID0+IGJ1ZmZlci5kZXRhY2hlZDtcbiAgfSBlbHNlIHtcbiAgICAvLyBOb3QgaW1wbGVtZW50ZWQgY29ycmVjdGx5XG4gICAgSXNEZXRhY2hlZEJ1ZmZlciA9IGJ1ZmZlciA9PiBidWZmZXIuYnl0ZUxlbmd0aCA9PT0gMDtcbiAgfVxuICByZXR1cm4gSXNEZXRhY2hlZEJ1ZmZlcihPKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBBcnJheUJ1ZmZlclNsaWNlKGJ1ZmZlcjogQXJyYXlCdWZmZXIsIGJlZ2luOiBudW1iZXIsIGVuZDogbnVtYmVyKTogQXJyYXlCdWZmZXIge1xuICAvLyBBcnJheUJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgaXMgbm90IGF2YWlsYWJsZSBvbiBJRTEwXG4gIC8vIGh0dHBzOi8vd3d3LmNhbml1c2UuY29tL21kbi1qYXZhc2NyaXB0X2J1aWx0aW5zX2FycmF5YnVmZmVyX3NsaWNlXG4gIGlmIChidWZmZXIuc2xpY2UpIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKGJlZ2luLCBlbmQpO1xuICB9XG4gIGNvbnN0IGxlbmd0aCA9IGVuZCAtIGJlZ2luO1xuICBjb25zdCBzbGljZSA9IG5ldyBBcnJheUJ1ZmZlcihsZW5ndGgpO1xuICBDb3B5RGF0YUJsb2NrQnl0ZXMoc2xpY2UsIDAsIGJ1ZmZlciwgYmVnaW4sIGxlbmd0aCk7XG4gIHJldHVybiBzbGljZTtcbn1cblxuZXhwb3J0IHR5cGUgTWV0aG9kTmFtZTxUPiA9IHtcbiAgW1AgaW4ga2V5b2YgVF06IFRbUF0gZXh0ZW5kcyBGdW5jdGlvbiB8IHVuZGVmaW5lZCA/IFAgOiBuZXZlcjtcbn1ba2V5b2YgVF07XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRNZXRob2Q8VCwgSyBleHRlbmRzIE1ldGhvZE5hbWU8VD4+KHJlY2VpdmVyOiBULCBwcm9wOiBLKTogVFtLXSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGZ1bmMgPSByZWNlaXZlcltwcm9wXTtcbiAgaWYgKGZ1bmMgPT09IHVuZGVmaW5lZCB8fCBmdW5jID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAodHlwZW9mIGZ1bmMgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke1N0cmluZyhwcm9wKX0gaXMgbm90IGEgZnVuY3Rpb25gKTtcbiAgfVxuICByZXR1cm4gZnVuYztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTeW5jSXRlcmF0b3JSZWNvcmQ8VD4ge1xuICBpdGVyYXRvcjogSXRlcmF0b3I8VD4sXG4gIG5leHRNZXRob2Q6IEl0ZXJhdG9yPFQ+WyduZXh0J10sXG4gIGRvbmU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXN5bmNJdGVyYXRvclJlY29yZDxUPiB7XG4gIGl0ZXJhdG9yOiBBc3luY0l0ZXJhdG9yPFQ+LFxuICBuZXh0TWV0aG9kOiBBc3luY0l0ZXJhdG9yPFQ+WyduZXh0J10sXG4gIGRvbmU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCB0eXBlIFN5bmNPckFzeW5jSXRlcmF0b3JSZWNvcmQ8VD4gPSBTeW5jSXRlcmF0b3JSZWNvcmQ8VD4gfCBBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlQXN5bmNGcm9tU3luY0l0ZXJhdG9yPFQ+KHN5bmNJdGVyYXRvclJlY29yZDogU3luY0l0ZXJhdG9yUmVjb3JkPFQ+KTogQXN5bmNJdGVyYXRvclJlY29yZDxUPiB7XG4gIC8vIEluc3RlYWQgb2YgcmUtaW1wbGVtZW50aW5nIENyZWF0ZUFzeW5jRnJvbVN5bmNJdGVyYXRvciBhbmQgJUFzeW5jRnJvbVN5bmNJdGVyYXRvclByb3RvdHlwZSUsXG4gIC8vIHdlIHVzZSB5aWVsZCogaW5zaWRlIGFuIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiB0byBhY2hpZXZlIHRoZSBzYW1lIHJlc3VsdC5cblxuICAvLyBXcmFwIHRoZSBzeW5jIGl0ZXJhdG9yIGluc2lkZSBhIHN5bmMgaXRlcmFibGUsIHNvIHdlIGNhbiB1c2UgaXQgd2l0aCB5aWVsZCouXG4gIGNvbnN0IHN5bmNJdGVyYWJsZSA9IHtcbiAgICBbU3ltYm9sLml0ZXJhdG9yXTogKCkgPT4gc3luY0l0ZXJhdG9yUmVjb3JkLml0ZXJhdG9yXG4gIH07XG4gIC8vIENyZWF0ZSBhbiBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gYW5kIGltbWVkaWF0ZWx5IGludm9rZSBpdC5cbiAgY29uc3QgYXN5bmNJdGVyYXRvciA9IChhc3luYyBmdW5jdGlvbiogKCkge1xuICAgIHJldHVybiB5aWVsZCogc3luY0l0ZXJhYmxlO1xuICB9KCkpO1xuICAvLyBSZXR1cm4gYXMgYW4gYXN5bmMgaXRlcmF0b3IgcmVjb3JkLlxuICBjb25zdCBuZXh0TWV0aG9kID0gYXN5bmNJdGVyYXRvci5uZXh0O1xuICByZXR1cm4geyBpdGVyYXRvcjogYXN5bmNJdGVyYXRvciwgbmV4dE1ldGhvZCwgZG9uZTogZmFsc2UgfTtcbn1cblxuLy8gQWxpZ25zIHdpdGggY29yZS1qcy9tb2R1bGVzL2VzLnN5bWJvbC5hc3luYy1pdGVyYXRvci5qc1xuZXhwb3J0IGNvbnN0IFN5bWJvbEFzeW5jSXRlcmF0b3I6ICh0eXBlb2YgU3ltYm9sKVsnYXN5bmNJdGVyYXRvciddID1cbiAgU3ltYm9sLmFzeW5jSXRlcmF0b3IgPz9cbiAgU3ltYm9sLmZvcj8uKCdTeW1ib2wuYXN5bmNJdGVyYXRvcicpID8/XG4gICdAQGFzeW5jSXRlcmF0b3InO1xuXG5leHBvcnQgdHlwZSBTeW5jT3JBc3luY0l0ZXJhYmxlPFQ+ID0gSXRlcmFibGU8VD4gfCBBc3luY0l0ZXJhYmxlPFQ+O1xuZXhwb3J0IHR5cGUgU3luY09yQXN5bmNJdGVyYXRvck1ldGhvZDxUPiA9ICgpID0+IChJdGVyYXRvcjxUPiB8IEFzeW5jSXRlcmF0b3I8VD4pO1xuXG5mdW5jdGlvbiBHZXRJdGVyYXRvcjxUPihcbiAgb2JqOiBTeW5jT3JBc3luY0l0ZXJhYmxlPFQ+LFxuICBoaW50OiAnYXN5bmMnLFxuICBtZXRob2Q/OiBTeW5jT3JBc3luY0l0ZXJhdG9yTWV0aG9kPFQ+XG4pOiBBc3luY0l0ZXJhdG9yUmVjb3JkPFQ+O1xuZnVuY3Rpb24gR2V0SXRlcmF0b3I8VD4oXG4gIG9iajogSXRlcmFibGU8VD4sXG4gIGhpbnQ6ICdzeW5jJyxcbiAgbWV0aG9kPzogU3luY09yQXN5bmNJdGVyYXRvck1ldGhvZDxUPlxuKTogU3luY0l0ZXJhdG9yUmVjb3JkPFQ+O1xuZnVuY3Rpb24gR2V0SXRlcmF0b3I8VD4oXG4gIG9iajogU3luY09yQXN5bmNJdGVyYWJsZTxUPixcbiAgaGludCA9ICdzeW5jJyxcbiAgbWV0aG9kPzogU3luY09yQXN5bmNJdGVyYXRvck1ldGhvZDxUPlxuKTogU3luY09yQXN5bmNJdGVyYXRvclJlY29yZDxUPiB7XG4gIGFzc2VydChoaW50ID09PSAnc3luYycgfHwgaGludCA9PT0gJ2FzeW5jJyk7XG4gIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChoaW50ID09PSAnYXN5bmMnKSB7XG4gICAgICBtZXRob2QgPSBHZXRNZXRob2Qob2JqIGFzIEFzeW5jSXRlcmFibGU8VD4sIFN5bWJvbEFzeW5jSXRlcmF0b3IpO1xuICAgICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHN5bmNNZXRob2QgPSBHZXRNZXRob2Qob2JqIGFzIEl0ZXJhYmxlPFQ+LCBTeW1ib2wuaXRlcmF0b3IpO1xuICAgICAgICBjb25zdCBzeW5jSXRlcmF0b3JSZWNvcmQgPSBHZXRJdGVyYXRvcihvYmogYXMgSXRlcmFibGU8VD4sICdzeW5jJywgc3luY01ldGhvZCk7XG4gICAgICAgIHJldHVybiBDcmVhdGVBc3luY0Zyb21TeW5jSXRlcmF0b3Ioc3luY0l0ZXJhdG9yUmVjb3JkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWV0aG9kID0gR2V0TWV0aG9kKG9iaiBhcyBJdGVyYWJsZTxUPiwgU3ltYm9sLml0ZXJhdG9yKTtcbiAgICB9XG4gIH1cbiAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIG9iamVjdCBpcyBub3QgaXRlcmFibGUnKTtcbiAgfVxuICBjb25zdCBpdGVyYXRvciA9IHJlZmxlY3RDYWxsKG1ldGhvZCwgb2JqLCBbXSk7XG4gIGlmICghdHlwZUlzT2JqZWN0KGl0ZXJhdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBpdGVyYXRvciBtZXRob2QgbXVzdCByZXR1cm4gYW4gb2JqZWN0Jyk7XG4gIH1cbiAgY29uc3QgbmV4dE1ldGhvZCA9IGl0ZXJhdG9yLm5leHQ7XG4gIHJldHVybiB7IGl0ZXJhdG9yLCBuZXh0TWV0aG9kLCBkb25lOiBmYWxzZSB9IGFzIFN5bmNPckFzeW5jSXRlcmF0b3JSZWNvcmQ8VD47XG59XG5cbmV4cG9ydCB7IEdldEl0ZXJhdG9yIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBJdGVyYXRvck5leHQ8VD4oaXRlcmF0b3JSZWNvcmQ6IEFzeW5jSXRlcmF0b3JSZWNvcmQ8VD4pOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFQ+PiB7XG4gIGNvbnN0IHJlc3VsdCA9IHJlZmxlY3RDYWxsKGl0ZXJhdG9yUmVjb3JkLm5leHRNZXRob2QsIGl0ZXJhdG9yUmVjb3JkLml0ZXJhdG9yLCBbXSk7XG4gIGlmICghdHlwZUlzT2JqZWN0KHJlc3VsdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgaXRlcmF0b3IubmV4dCgpIG1ldGhvZCBtdXN0IHJldHVybiBhbiBvYmplY3QnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXRlcmF0b3JDb21wbGV0ZTxUUmV0dXJuPihcbiAgaXRlclJlc3VsdDogSXRlcmF0b3JSZXN1bHQ8dW5rbm93biwgVFJldHVybj5cbik6IGl0ZXJSZXN1bHQgaXMgSXRlcmF0b3JSZXR1cm5SZXN1bHQ8VFJldHVybj4ge1xuICBhc3NlcnQodHlwZUlzT2JqZWN0KGl0ZXJSZXN1bHQpKTtcbiAgcmV0dXJuIEJvb2xlYW4oaXRlclJlc3VsdC5kb25lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEl0ZXJhdG9yVmFsdWU8VD4oaXRlclJlc3VsdDogSXRlcmF0b3JZaWVsZFJlc3VsdDxUPik6IFQge1xuICBhc3NlcnQodHlwZUlzT2JqZWN0KGl0ZXJSZXN1bHQpKTtcbiAgcmV0dXJuIGl0ZXJSZXN1bHQudmFsdWU7XG59XG4iLCAiaW1wb3J0IE51bWJlcklzTmFOIGZyb20gJy4uLy4uL3N0dWIvbnVtYmVyLWlzbmFuJztcbmltcG9ydCB7IEFycmF5QnVmZmVyU2xpY2UgfSBmcm9tICcuL2VjbWFzY3JpcHQnO1xuaW1wb3J0IHR5cGUgeyBOb25TaGFyZWQgfSBmcm9tICcuLi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3JztcblxuZXhwb3J0IGZ1bmN0aW9uIElzTm9uTmVnYXRpdmVOdW1iZXIodjogbnVtYmVyKTogYm9vbGVhbiB7XG4gIGlmICh0eXBlb2YgdiAhPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoTnVtYmVySXNOYU4odikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodiA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENsb25lQXNVaW50OEFycmF5KE86IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+KTogTm9uU2hhcmVkPFVpbnQ4QXJyYXk+IHtcbiAgY29uc3QgYnVmZmVyID0gQXJyYXlCdWZmZXJTbGljZShPLmJ1ZmZlciwgTy5ieXRlT2Zmc2V0LCBPLmJ5dGVPZmZzZXQgKyBPLmJ5dGVMZW5ndGgpO1xuICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSBhcyBOb25TaGFyZWQ8VWludDhBcnJheT47XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQgeyBTaW1wbGVRdWV1ZSB9IGZyb20gJy4uL3NpbXBsZS1xdWV1ZSc7XG5pbXBvcnQgeyBJc05vbk5lZ2F0aXZlTnVtYmVyIH0gZnJvbSAnLi9taXNjZWxsYW5lb3VzJztcblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZUNvbnRhaW5lcjxUPiB7XG4gIF9xdWV1ZTogU2ltcGxlUXVldWU8VD47XG4gIF9xdWV1ZVRvdGFsU2l6ZTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXVlUGFpcjxUPiB7XG4gIHZhbHVlOiBUO1xuICBzaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBEZXF1ZXVlVmFsdWU8VD4oY29udGFpbmVyOiBRdWV1ZUNvbnRhaW5lcjxRdWV1ZVBhaXI8VD4+KTogVCB7XG4gIGFzc2VydCgnX3F1ZXVlJyBpbiBjb250YWluZXIgJiYgJ19xdWV1ZVRvdGFsU2l6ZScgaW4gY29udGFpbmVyKTtcbiAgYXNzZXJ0KGNvbnRhaW5lci5fcXVldWUubGVuZ3RoID4gMCk7XG5cbiAgY29uc3QgcGFpciA9IGNvbnRhaW5lci5fcXVldWUuc2hpZnQoKSE7XG4gIGNvbnRhaW5lci5fcXVldWVUb3RhbFNpemUgLT0gcGFpci5zaXplO1xuICBpZiAoY29udGFpbmVyLl9xdWV1ZVRvdGFsU2l6ZSA8IDApIHtcbiAgICBjb250YWluZXIuX3F1ZXVlVG90YWxTaXplID0gMDtcbiAgfVxuXG4gIHJldHVybiBwYWlyLnZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRW5xdWV1ZVZhbHVlV2l0aFNpemU8VD4oY29udGFpbmVyOiBRdWV1ZUNvbnRhaW5lcjxRdWV1ZVBhaXI8VD4+LCB2YWx1ZTogVCwgc2l6ZTogbnVtYmVyKSB7XG4gIGFzc2VydCgnX3F1ZXVlJyBpbiBjb250YWluZXIgJiYgJ19xdWV1ZVRvdGFsU2l6ZScgaW4gY29udGFpbmVyKTtcblxuICBpZiAoIUlzTm9uTmVnYXRpdmVOdW1iZXIoc2l6ZSkgfHwgc2l6ZSA9PT0gSW5maW5pdHkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignU2l6ZSBtdXN0IGJlIGEgZmluaXRlLCBub24tTmFOLCBub24tbmVnYXRpdmUgbnVtYmVyLicpO1xuICB9XG5cbiAgY29udGFpbmVyLl9xdWV1ZS5wdXNoKHsgdmFsdWUsIHNpemUgfSk7XG4gIGNvbnRhaW5lci5fcXVldWVUb3RhbFNpemUgKz0gc2l6ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFBlZWtRdWV1ZVZhbHVlPFQ+KGNvbnRhaW5lcjogUXVldWVDb250YWluZXI8UXVldWVQYWlyPFQ+Pik6IFQge1xuICBhc3NlcnQoJ19xdWV1ZScgaW4gY29udGFpbmVyICYmICdfcXVldWVUb3RhbFNpemUnIGluIGNvbnRhaW5lcik7XG4gIGFzc2VydChjb250YWluZXIuX3F1ZXVlLmxlbmd0aCA+IDApO1xuXG4gIGNvbnN0IHBhaXIgPSBjb250YWluZXIuX3F1ZXVlLnBlZWsoKTtcbiAgcmV0dXJuIHBhaXIudmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNldFF1ZXVlPFQ+KGNvbnRhaW5lcjogUXVldWVDb250YWluZXI8VD4pIHtcbiAgYXNzZXJ0KCdfcXVldWUnIGluIGNvbnRhaW5lciAmJiAnX3F1ZXVlVG90YWxTaXplJyBpbiBjb250YWluZXIpO1xuXG4gIGNvbnRhaW5lci5fcXVldWUgPSBuZXcgU2ltcGxlUXVldWU8VD4oKTtcbiAgY29udGFpbmVyLl9xdWV1ZVRvdGFsU2l6ZSA9IDA7XG59XG4iLCAiZXhwb3J0IHR5cGUgVHlwZWRBcnJheSA9XG4gIHwgSW50OEFycmF5XG4gIHwgVWludDhBcnJheVxuICB8IFVpbnQ4Q2xhbXBlZEFycmF5XG4gIHwgSW50MTZBcnJheVxuICB8IFVpbnQxNkFycmF5XG4gIHwgSW50MzJBcnJheVxuICB8IFVpbnQzMkFycmF5XG4gIHwgRmxvYXQzMkFycmF5XG4gIHwgRmxvYXQ2NEFycmF5O1xuXG5leHBvcnQgdHlwZSBOb25TaGFyZWQ8VCBleHRlbmRzIEFycmF5QnVmZmVyVmlldz4gPSBUICYge1xuICBidWZmZXI6IEFycmF5QnVmZmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5QnVmZmVyVmlld0NvbnN0cnVjdG9yPFQgZXh0ZW5kcyBBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlclZpZXc+IHtcbiAgbmV3KGJ1ZmZlcjogQXJyYXlCdWZmZXIsIGJ5dGVPZmZzZXQ6IG51bWJlciwgbGVuZ3RoPzogbnVtYmVyKTogVDtcblxuICByZWFkb25seSBwcm90b3R5cGU6IFQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZWRBcnJheUNvbnN0cnVjdG9yPFQgZXh0ZW5kcyBUeXBlZEFycmF5ID0gVHlwZWRBcnJheT4gZXh0ZW5kcyBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcjxUPiB7XG4gIHJlYWRvbmx5IEJZVEVTX1BFUl9FTEVNRU5UOiBudW1iZXI7XG59XG5cbmV4cG9ydCB0eXBlIERhdGFWaWV3Q29uc3RydWN0b3IgPSBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcjxEYXRhVmlldz47XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXdDb25zdHJ1Y3RvcihjdG9yOiBGdW5jdGlvbik6IGN0b3IgaXMgRGF0YVZpZXdDb25zdHJ1Y3RvciB7XG4gIHJldHVybiBjdG9yID09PSBEYXRhVmlldztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YVZpZXcodmlldzogQXJyYXlCdWZmZXJWaWV3KTogdmlldyBpcyBEYXRhVmlldyB7XG4gIHJldHVybiBpc0RhdGFWaWV3Q29uc3RydWN0b3Iodmlldy5jb25zdHJ1Y3Rvcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUJ1ZmZlclZpZXdFbGVtZW50U2l6ZTxUIGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3PihjdG9yOiBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcjxUPik6IG51bWJlciB7XG4gIGlmIChpc0RhdGFWaWV3Q29uc3RydWN0b3IoY3RvcikpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gKGN0b3IgYXMgdW5rbm93biBhcyBUeXBlZEFycmF5Q29uc3RydWN0b3IpLkJZVEVTX1BFUl9FTEVNRU5UO1xufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgU2ltcGxlUXVldWUgfSBmcm9tICcuLi9zaW1wbGUtcXVldWUnO1xuaW1wb3J0IHsgUmVzZXRRdWV1ZSB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9xdWV1ZS13aXRoLXNpemVzJztcbmltcG9ydCB7XG4gIElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRSZXF1ZXN0LFxuICBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkUmVxdWVzdCxcbiAgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMsXG4gIFJlYWRhYmxlU3RyZWFtSGFzRGVmYXVsdFJlYWRlcixcbiAgdHlwZSBSZWFkUmVxdWVzdFxufSBmcm9tICcuL2RlZmF1bHQtcmVhZGVyJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtQWRkUmVhZEludG9SZXF1ZXN0LFxuICBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkSW50b1JlcXVlc3QsXG4gIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZEludG9SZXF1ZXN0cyxcbiAgUmVhZGFibGVTdHJlYW1IYXNCWU9CUmVhZGVyLFxuICB0eXBlIFJlYWRJbnRvUmVxdWVzdFxufSBmcm9tICcuL2J5b2ItcmVhZGVyJztcbmltcG9ydCBOdW1iZXJJc0ludGVnZXIgZnJvbSAnLi4vLi4vc3R1Yi9udW1iZXItaXNpbnRlZ2VyJztcbmltcG9ydCB7XG4gIElzUmVhZGFibGVTdHJlYW1Mb2NrZWQsXG4gIHR5cGUgUmVhZGFibGVCeXRlU3RyZWFtLFxuICBSZWFkYWJsZVN0cmVhbUNsb3NlLFxuICBSZWFkYWJsZVN0cmVhbUVycm9yXG59IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgdHlwZSB7IFZhbGlkYXRlZFVuZGVybHlpbmdCeXRlU291cmNlIH0gZnJvbSAnLi91bmRlcmx5aW5nLXNvdXJjZSc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQge1xuICBBcnJheUJ1ZmZlclNsaWNlLFxuICBDYW5UcmFuc2ZlckFycmF5QnVmZmVyLFxuICBDb3B5RGF0YUJsb2NrQnl0ZXMsXG4gIElzRGV0YWNoZWRCdWZmZXIsXG4gIFRyYW5zZmVyQXJyYXlCdWZmZXJcbn0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2VjbWFzY3JpcHQnO1xuaW1wb3J0IHsgQ2FuY2VsU3RlcHMsIFB1bGxTdGVwcywgUmVsZWFzZVN0ZXBzIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2ludGVybmFsLW1ldGhvZHMnO1xuaW1wb3J0IHsgcHJvbWlzZVJlc29sdmVkV2l0aCwgdXBvblByb21pc2UgfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50LCBjb252ZXJ0VW5zaWduZWRMb25nTG9uZ1dpdGhFbmZvcmNlUmFuZ2UgfSBmcm9tICcuLi92YWxpZGF0b3JzL2Jhc2ljJztcbmltcG9ydCB7XG4gIHR5cGUgQXJyYXlCdWZmZXJWaWV3Q29uc3RydWN0b3IsXG4gIGFycmF5QnVmZmVyVmlld0VsZW1lbnRTaXplLFxuICB0eXBlIE5vblNoYXJlZCxcbiAgdHlwZSBUeXBlZEFycmF5Q29uc3RydWN0b3Jcbn0gZnJvbSAnLi4vaGVscGVycy9hcnJheS1idWZmZXItdmlldyc7XG5cbi8qKlxuICogQSBwdWxsLWludG8gcmVxdWVzdCBpbiBhIHtAbGluayBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyfS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIhOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyO1xuICAvKiogQGludGVybmFsICovXG4gIF92aWV3ITogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4gfCBudWxsO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSWxsZWdhbCBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZpZXcgZm9yIHdyaXRpbmcgaW4gdG8sIG9yIGBudWxsYCBpZiB0aGUgQllPQiByZXF1ZXN0IGhhcyBhbHJlYWR5IGJlZW4gcmVzcG9uZGVkIHRvLlxuICAgKi9cbiAgZ2V0IHZpZXcoKTogQXJyYXlCdWZmZXJWaWV3IHwgbnVsbCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QodGhpcykpIHtcbiAgICAgIHRocm93IGJ5b2JSZXF1ZXN0QnJhbmRDaGVja0V4Y2VwdGlvbigndmlldycpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl92aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB0byB0aGUgYXNzb2NpYXRlZCByZWFkYWJsZSBieXRlIHN0cmVhbSB0aGF0IGBieXRlc1dyaXR0ZW5gIGJ5dGVzIHdlcmUgd3JpdHRlbiBpbnRvXG4gICAqIHtAbGluayBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnZpZXcgfCB2aWV3fSwgY2F1c2luZyB0aGUgcmVzdWx0IGJlIHN1cmZhY2VkIHRvIHRoZSBjb25zdW1lci5cbiAgICpcbiAgICogQWZ0ZXIgdGhpcyBtZXRob2QgaXMgY2FsbGVkLCB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC52aWV3IHwgdmlld30gd2lsbCBiZSB0cmFuc2ZlcnJlZCBhbmQgbm8gbG9uZ2VyXG4gICAqIG1vZGlmaWFibGUuXG4gICAqL1xuICByZXNwb25kKGJ5dGVzV3JpdHRlbjogbnVtYmVyKTogdm9pZDtcbiAgcmVzcG9uZChieXRlc1dyaXR0ZW46IG51bWJlciB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0KHRoaXMpKSB7XG4gICAgICB0aHJvdyBieW9iUmVxdWVzdEJyYW5kQ2hlY2tFeGNlcHRpb24oJ3Jlc3BvbmQnKTtcbiAgICB9XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChieXRlc1dyaXR0ZW4sIDEsICdyZXNwb25kJyk7XG4gICAgYnl0ZXNXcml0dGVuID0gY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlKGJ5dGVzV3JpdHRlbiwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgaWYgKHRoaXMuX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXMgQllPQiByZXF1ZXN0IGhhcyBiZWVuIGludmFsaWRhdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKElzRGV0YWNoZWRCdWZmZXIodGhpcy5fdmlldyEuYnVmZmVyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVGhlIEJZT0IgcmVxdWVzdCdzIGJ1ZmZlciBoYXMgYmVlbiBkZXRhY2hlZCBhbmQgc28gY2Fubm90IGJlIHVzZWQgYXMgYSByZXNwb25zZWApO1xuICAgIH1cblxuICAgIGFzc2VydCh0aGlzLl92aWV3IS5ieXRlTGVuZ3RoID4gMCk7XG4gICAgYXNzZXJ0KHRoaXMuX3ZpZXchLmJ1ZmZlci5ieXRlTGVuZ3RoID4gMCk7XG5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZCh0aGlzLl9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciwgYnl0ZXNXcml0dGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdG8gdGhlIGFzc29jaWF0ZWQgcmVhZGFibGUgYnl0ZSBzdHJlYW0gdGhhdCBpbnN0ZWFkIG9mIHdyaXRpbmcgaW50b1xuICAgKiB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC52aWV3IHwgdmlld30sIHRoZSB1bmRlcmx5aW5nIGJ5dGUgc291cmNlIGlzIHByb3ZpZGluZyBhIG5ldyBgQXJyYXlCdWZmZXJWaWV3YCxcbiAgICogd2hpY2ggd2lsbCBiZSBnaXZlbiB0byB0aGUgY29uc3VtZXIgb2YgdGhlIHJlYWRhYmxlIGJ5dGUgc3RyZWFtLlxuICAgKlxuICAgKiBBZnRlciB0aGlzIG1ldGhvZCBpcyBjYWxsZWQsIGB2aWV3YCB3aWxsIGJlIHRyYW5zZmVycmVkIGFuZCBubyBsb25nZXIgbW9kaWZpYWJsZS5cbiAgICovXG4gIHJlc3BvbmRXaXRoTmV3Vmlldyh2aWV3OiBBcnJheUJ1ZmZlclZpZXcpOiB2b2lkO1xuICByZXNwb25kV2l0aE5ld1ZpZXcodmlldzogTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4pOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCh0aGlzKSkge1xuICAgICAgdGhyb3cgYnlvYlJlcXVlc3RCcmFuZENoZWNrRXhjZXB0aW9uKCdyZXNwb25kV2l0aE5ld1ZpZXcnKTtcbiAgICB9XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCh2aWV3LCAxLCAncmVzcG9uZFdpdGhOZXdWaWV3Jyk7XG5cbiAgICBpZiAoIUFycmF5QnVmZmVyLmlzVmlldyh2aWV3KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IGNhbiBvbmx5IHJlc3BvbmQgd2l0aCBhcnJheSBidWZmZXIgdmlld3MnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhpcyBCWU9CIHJlcXVlc3QgaGFzIGJlZW4gaW52YWxpZGF0ZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcih2aWV3LmJ1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBnaXZlbiB2aWV3XFwncyBidWZmZXIgaGFzIGJlZW4gZGV0YWNoZWQgYW5kIHNvIGNhbm5vdCBiZSB1c2VkIGFzIGEgcmVzcG9uc2UnKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZFdpdGhOZXdWaWV3KHRoaXMuX2Fzc29jaWF0ZWRSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLCB2aWV3KTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LnByb3RvdHlwZSwge1xuICByZXNwb25kOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVzcG9uZFdpdGhOZXdWaWV3OiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgdmlldzogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlLnJlc3BvbmQsICdyZXNwb25kJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC5wcm90b3R5cGUucmVzcG9uZFdpdGhOZXdWaWV3LCAncmVzcG9uZFdpdGhOZXdWaWV3Jyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1JlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QnLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuaW50ZXJmYWNlIEJ5dGVRdWV1ZUVsZW1lbnQge1xuICBidWZmZXI6IEFycmF5QnVmZmVyO1xuICBieXRlT2Zmc2V0OiBudW1iZXI7XG4gIGJ5dGVMZW5ndGg6IG51bWJlcjtcbn1cblxudHlwZSBQdWxsSW50b0Rlc2NyaXB0b3I8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+ID0gTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+ID1cbiAgRGVmYXVsdFB1bGxJbnRvRGVzY3JpcHRvclxuICB8IEJZT0JQdWxsSW50b0Rlc2NyaXB0b3I8VD47XG5cbmludGVyZmFjZSBEZWZhdWx0UHVsbEludG9EZXNjcmlwdG9yIHtcbiAgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbiAgYnVmZmVyQnl0ZUxlbmd0aDogbnVtYmVyO1xuICBieXRlT2Zmc2V0OiBudW1iZXI7XG4gIGJ5dGVMZW5ndGg6IG51bWJlcjtcbiAgYnl0ZXNGaWxsZWQ6IG51bWJlcjtcbiAgbWluaW11bUZpbGw6IG51bWJlcjtcbiAgZWxlbWVudFNpemU6IG51bWJlcjtcbiAgdmlld0NvbnN0cnVjdG9yOiBUeXBlZEFycmF5Q29uc3RydWN0b3I8VWludDhBcnJheT47XG4gIHJlYWRlclR5cGU6ICdkZWZhdWx0JyB8ICdub25lJztcbn1cblxuaW50ZXJmYWNlIEJZT0JQdWxsSW50b0Rlc2NyaXB0b3I8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+ID0gTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+IHtcbiAgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbiAgYnVmZmVyQnl0ZUxlbmd0aDogbnVtYmVyO1xuICBieXRlT2Zmc2V0OiBudW1iZXI7XG4gIGJ5dGVMZW5ndGg6IG51bWJlcjtcbiAgYnl0ZXNGaWxsZWQ6IG51bWJlcjtcbiAgbWluaW11bUZpbGw6IG51bWJlcjtcbiAgZWxlbWVudFNpemU6IG51bWJlcjtcbiAgdmlld0NvbnN0cnVjdG9yOiBBcnJheUJ1ZmZlclZpZXdDb25zdHJ1Y3RvcjxUPjtcbiAgcmVhZGVyVHlwZTogJ2J5b2InIHwgJ25vbmUnO1xufVxuXG4vKipcbiAqIEFsbG93cyBjb250cm9sIG9mIGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtIHwgcmVhZGFibGUgYnl0ZSBzdHJlYW19J3Mgc3RhdGUgYW5kIGludGVybmFsIHF1ZXVlLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIge1xuICAvKiogQGludGVybmFsICovXG4gIF9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtITogUmVhZGFibGVCeXRlU3RyZWFtO1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZSE6IFNpbXBsZVF1ZXVlPEJ5dGVRdWV1ZUVsZW1lbnQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZVRvdGFsU2l6ZSE6IG51bWJlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RhcnRlZCE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlUmVxdWVzdGVkITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHVsbEFnYWluITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHVsbGluZyAhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdHJhdGVneUhXTSE6IG51bWJlcjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcHVsbEFsZ29yaXRobSE6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NhbmNlbEFsZ29yaXRobSE6IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYXV0b0FsbG9jYXRlQ2h1bmtTaXplOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2J5b2JSZXF1ZXN0OiBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0IHwgbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ1B1bGxJbnRvcyE6IFNpbXBsZVF1ZXVlPFB1bGxJbnRvRGVzY3JpcHRvcj47XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbGxlZ2FsIGNvbnN0cnVjdG9yJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBCWU9CIHB1bGwgcmVxdWVzdCwgb3IgYG51bGxgIGlmIHRoZXJlIGlzbid0IG9uZS5cbiAgICovXG4gIGdldCBieW9iUmVxdWVzdCgpOiBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0IHwgbnVsbCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVTdHJlYW1Db250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignYnlvYlJlcXVlc3QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldEJZT0JSZXF1ZXN0KHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlc2lyZWQgc2l6ZSB0byBmaWxsIHRoZSBjb250cm9sbGVkIHN0cmVhbSdzIGludGVybmFsIHF1ZXVlLiBJdCBjYW4gYmUgbmVnYXRpdmUsIGlmIHRoZSBxdWV1ZSBpc1xuICAgKiBvdmVyLWZ1bGwuIEFuIHVuZGVybHlpbmcgYnl0ZSBzb3VyY2Ugb3VnaHQgdG8gdXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gZGV0ZXJtaW5lIHdoZW4gYW5kIGhvdyB0byBhcHBseSBiYWNrcHJlc3N1cmUuXG4gICAqL1xuICBnZXQgZGVzaXJlZFNpemUoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVTdHJlYW1Db250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZGVzaXJlZFNpemUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldERlc2lyZWRTaXplKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgY29udHJvbGxlZCByZWFkYWJsZSBzdHJlYW0uIENvbnN1bWVycyB3aWxsIHN0aWxsIGJlIGFibGUgdG8gcmVhZCBhbnkgcHJldmlvdXNseS1lbnF1ZXVlZCBjaHVua3MgZnJvbVxuICAgKiB0aGUgc3RyZWFtLCBidXQgb25jZSB0aG9zZSBhcmUgcmVhZCwgdGhlIHN0cmVhbSB3aWxsIGJlY29tZSBjbG9zZWQuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgYnl0ZVN0cmVhbUNvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjbG9zZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9jbG9zZVJlcXVlc3RlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHN0cmVhbSBoYXMgYWxyZWFkeSBiZWVuIGNsb3NlZDsgZG8gbm90IGNsb3NlIGl0IGFnYWluIScpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGU7XG4gICAgaWYgKHN0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUaGUgc3RyZWFtIChpbiAke3N0YXRlfSBzdGF0ZSkgaXMgbm90IGluIHRoZSByZWFkYWJsZSBzdGF0ZSBhbmQgY2Fubm90IGJlIGNsb3NlZGApO1xuICAgIH1cblxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnF1ZXVlcyB0aGUgZ2l2ZW4gY2h1bmsgY2h1bmsgaW4gdGhlIGNvbnRyb2xsZWQgcmVhZGFibGUgc3RyZWFtLlxuICAgKiBUaGUgY2h1bmsgaGFzIHRvIGJlIGFuIGBBcnJheUJ1ZmZlclZpZXdgIGluc3RhbmNlLCBvciBlbHNlIGEgYFR5cGVFcnJvcmAgd2lsbCBiZSB0aHJvd24uXG4gICAqL1xuICBlbnF1ZXVlKGNodW5rOiBBcnJheUJ1ZmZlclZpZXcpOiB2b2lkO1xuICBlbnF1ZXVlKGNodW5rOiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pik6IHZvaWQge1xuICAgIGlmICghSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieXRlU3RyZWFtQ29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2VucXVldWUnKTtcbiAgICB9XG5cbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KGNodW5rLCAxLCAnZW5xdWV1ZScpO1xuICAgIGlmICghQXJyYXlCdWZmZXIuaXNWaWV3KGNodW5rKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2h1bmsgbXVzdCBiZSBhbiBhcnJheSBidWZmZXIgdmlldycpO1xuICAgIH1cbiAgICBpZiAoY2h1bmsuYnl0ZUxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2h1bmsgbXVzdCBoYXZlIG5vbi16ZXJvIGJ5dGVMZW5ndGgnKTtcbiAgICB9XG4gICAgaWYgKGNodW5rLmJ1ZmZlci5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBjaHVuaydzIGJ1ZmZlciBtdXN0IGhhdmUgbm9uLXplcm8gYnl0ZUxlbmd0aGApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9jbG9zZVJlcXVlc3RlZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyZWFtIGlzIGNsb3NlZCBvciBkcmFpbmluZycpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbS5fc3RhdGU7XG4gICAgaWYgKHN0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUaGUgc3RyZWFtIChpbiAke3N0YXRlfSBzdGF0ZSkgaXMgbm90IGluIHRoZSByZWFkYWJsZSBzdGF0ZSBhbmQgY2Fubm90IGJlIGVucXVldWVkIHRvYCk7XG4gICAgfVxuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWUodGhpcywgY2h1bmspO1xuICB9XG5cbiAgLyoqXG4gICAqIEVycm9ycyB0aGUgY29udHJvbGxlZCByZWFkYWJsZSBzdHJlYW0sIG1ha2luZyBhbGwgZnV0dXJlIGludGVyYWN0aW9ucyB3aXRoIGl0IGZhaWwgd2l0aCB0aGUgZ2l2ZW4gZXJyb3IgYGVgLlxuICAgKi9cbiAgZXJyb3IoZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVTdHJlYW1Db250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZXJyb3InKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IodGhpcywgZSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtDYW5jZWxTdGVwc10ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJQZW5kaW5nUHVsbEludG9zKHRoaXMpO1xuXG4gICAgUmVzZXRRdWV1ZSh0aGlzKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2NhbmNlbEFsZ29yaXRobShyZWFzb24pO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhckFsZ29yaXRobXModGhpcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW1B1bGxTdGVwc10ocmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PE5vblNoYXJlZDxVaW50OEFycmF5Pj4pOiB2b2lkIHtcbiAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuICAgIGFzc2VydChSZWFkYWJsZVN0cmVhbUhhc0RlZmF1bHRSZWFkZXIoc3RyZWFtKSk7XG5cbiAgICBpZiAodGhpcy5fcXVldWVUb3RhbFNpemUgPiAwKSB7XG4gICAgICBhc3NlcnQoUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkUmVxdWVzdHMoc3RyZWFtKSA9PT0gMCk7XG5cbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGaWxsUmVhZFJlcXVlc3RGcm9tUXVldWUodGhpcywgcmVhZFJlcXVlc3QpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSA9IHRoaXMuX2F1dG9BbGxvY2F0ZUNodW5rU2l6ZTtcbiAgICBpZiAoYXV0b0FsbG9jYXRlQ2h1bmtTaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCBidWZmZXI6IEFycmF5QnVmZmVyO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSk7XG4gICAgICB9IGNhdGNoIChidWZmZXJFKSB7XG4gICAgICAgIHJlYWRSZXF1ZXN0Ll9lcnJvclN0ZXBzKGJ1ZmZlckUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHB1bGxJbnRvRGVzY3JpcHRvcjogRGVmYXVsdFB1bGxJbnRvRGVzY3JpcHRvciA9IHtcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBidWZmZXJCeXRlTGVuZ3RoOiBhdXRvQWxsb2NhdGVDaHVua1NpemUsXG4gICAgICAgIGJ5dGVPZmZzZXQ6IDAsXG4gICAgICAgIGJ5dGVMZW5ndGg6IGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSxcbiAgICAgICAgYnl0ZXNGaWxsZWQ6IDAsXG4gICAgICAgIG1pbmltdW1GaWxsOiAxLFxuICAgICAgICBlbGVtZW50U2l6ZTogMSxcbiAgICAgICAgdmlld0NvbnN0cnVjdG9yOiBVaW50OEFycmF5LFxuICAgICAgICByZWFkZXJUeXBlOiAnZGVmYXVsdCdcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX3BlbmRpbmdQdWxsSW50b3MucHVzaChwdWxsSW50b0Rlc2NyaXB0b3IpO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtQWRkUmVhZFJlcXVlc3Qoc3RyZWFtLCByZWFkUmVxdWVzdCk7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQodGhpcyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtSZWxlYXNlU3RlcHNdKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGZpcnN0UHVsbEludG8gPSB0aGlzLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgICAgIGZpcnN0UHVsbEludG8ucmVhZGVyVHlwZSA9ICdub25lJztcblxuICAgICAgdGhpcy5fcGVuZGluZ1B1bGxJbnRvcyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICAgICAgdGhpcy5fcGVuZGluZ1B1bGxJbnRvcy5wdXNoKGZpcnN0UHVsbEludG8pO1xuICAgIH1cbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZSwge1xuICBjbG9zZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGVucXVldWU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBlcnJvcjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGJ5b2JSZXF1ZXN0OiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZGVzaXJlZFNpemU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZS5jbG9zZSwgJ2Nsb3NlJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5wcm90b3R5cGUuZW5xdWV1ZSwgJ2VucXVldWUnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZS5lcnJvciwgJ2Vycm9yJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIuXG5cbmV4cG9ydCBmdW5jdGlvbiBJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoeDogYW55KTogeCBpcyBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyIHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcjtcbn1cblxuZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0KHg6IGFueSk6IHggaXMgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcicpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0O1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKTogdm9pZCB7XG4gIGNvbnN0IHNob3VsZFB1bGwgPSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hvdWxkQ2FsbFB1bGwoY29udHJvbGxlcik7XG4gIGlmICghc2hvdWxkUHVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9wdWxsaW5nKSB7XG4gICAgY29udHJvbGxlci5fcHVsbEFnYWluID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhc3NlcnQoIWNvbnRyb2xsZXIuX3B1bGxBZ2Fpbik7XG5cbiAgY29udHJvbGxlci5fcHVsbGluZyA9IHRydWU7XG5cbiAgLy8gVE9ETzogVGVzdCBjb250cm9sbGVyIGFyZ3VtZW50XG4gIGNvbnN0IHB1bGxQcm9taXNlID0gY29udHJvbGxlci5fcHVsbEFsZ29yaXRobSgpO1xuICB1cG9uUHJvbWlzZShcbiAgICBwdWxsUHJvbWlzZSxcbiAgICAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLl9wdWxsaW5nID0gZmFsc2U7XG5cbiAgICAgIGlmIChjb250cm9sbGVyLl9wdWxsQWdhaW4pIHtcbiAgICAgICAgY29udHJvbGxlci5fcHVsbEFnYWluID0gZmFsc2U7XG4gICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGUgPT4ge1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGUpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJQZW5kaW5nUHVsbEludG9zKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpIHtcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckludmFsaWRhdGVCWU9CUmVxdWVzdChjb250cm9sbGVyKTtcbiAgY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29tbWl0UHVsbEludG9EZXNjcmlwdG9yPFQgZXh0ZW5kcyBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pj4oXG4gIHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtLFxuICBwdWxsSW50b0Rlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcjxUPlxuKSB7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlICE9PSAnZXJyb3JlZCcpO1xuICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLnJlYWRlclR5cGUgIT09ICdub25lJyk7XG5cbiAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgYXNzZXJ0KHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCAlIHB1bGxJbnRvRGVzY3JpcHRvci5lbGVtZW50U2l6ZSA9PT0gMCk7XG4gICAgZG9uZSA9IHRydWU7XG4gIH1cblxuICBjb25zdCBmaWxsZWRWaWV3ID0gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbnZlcnRQdWxsSW50b0Rlc2NyaXB0b3I8VD4ocHVsbEludG9EZXNjcmlwdG9yKTtcbiAgaWYgKHB1bGxJbnRvRGVzY3JpcHRvci5yZWFkZXJUeXBlID09PSAnZGVmYXVsdCcpIHtcbiAgICBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkUmVxdWVzdChzdHJlYW0sIGZpbGxlZFZpZXcgYXMgdW5rbm93biBhcyBOb25TaGFyZWQ8VWludDhBcnJheT4sIGRvbmUpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IucmVhZGVyVHlwZSA9PT0gJ2J5b2InKTtcbiAgICBSZWFkYWJsZVN0cmVhbUZ1bGZpbGxSZWFkSW50b1JlcXVlc3Qoc3RyZWFtLCBmaWxsZWRWaWV3LCBkb25lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29udmVydFB1bGxJbnRvRGVzY3JpcHRvcjxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+KFxuICBwdWxsSW50b0Rlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcjxUPlxuKTogVCB7XG4gIGNvbnN0IGJ5dGVzRmlsbGVkID0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkO1xuICBjb25zdCBlbGVtZW50U2l6ZSA9IHB1bGxJbnRvRGVzY3JpcHRvci5lbGVtZW50U2l6ZTtcblxuICBhc3NlcnQoYnl0ZXNGaWxsZWQgPD0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVMZW5ndGgpO1xuICBhc3NlcnQoYnl0ZXNGaWxsZWQgJSBlbGVtZW50U2l6ZSA9PT0gMCk7XG5cbiAgcmV0dXJuIG5ldyBwdWxsSW50b0Rlc2NyaXB0b3Iudmlld0NvbnN0cnVjdG9yKFxuICAgIHB1bGxJbnRvRGVzY3JpcHRvci5idWZmZXIsIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlT2Zmc2V0LCBieXRlc0ZpbGxlZCAvIGVsZW1lbnRTaXplKSBhcyBUO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNodW5rVG9RdWV1ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVPZmZzZXQ6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVMZW5ndGg6IG51bWJlcikge1xuICBjb250cm9sbGVyLl9xdWV1ZS5wdXNoKHsgYnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoIH0pO1xuICBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSArPSBieXRlTGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNsb25lZENodW5rVG9RdWV1ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVPZmZzZXQ6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVMZW5ndGg6IG51bWJlcikge1xuICBsZXQgY2xvbmVkQ2h1bms7XG4gIHRyeSB7XG4gICAgY2xvbmVkQ2h1bmsgPSBBcnJheUJ1ZmZlclNsaWNlKGJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZU9mZnNldCArIGJ5dGVMZW5ndGgpO1xuICB9IGNhdGNoIChjbG9uZUUpIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgY2xvbmVFKTtcbiAgICB0aHJvdyBjbG9uZUU7XG4gIH1cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVDaHVua1RvUXVldWUoY29udHJvbGxlciwgY2xvbmVkQ2h1bmssIDAsIGJ5dGVMZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZURldGFjaGVkUHVsbEludG9Ub1F1ZXVlKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RGVzY3JpcHRvcjogUHVsbEludG9EZXNjcmlwdG9yKSB7XG4gIGFzc2VydChmaXJzdERlc2NyaXB0b3IucmVhZGVyVHlwZSA9PT0gJ25vbmUnKTtcbiAgaWYgKGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCA+IDApIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNsb25lZENodW5rVG9RdWV1ZShcbiAgICAgIGNvbnRyb2xsZXIsXG4gICAgICBmaXJzdERlc2NyaXB0b3IuYnVmZmVyLFxuICAgICAgZmlyc3REZXNjcmlwdG9yLmJ5dGVPZmZzZXQsXG4gICAgICBmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWRcbiAgICApO1xuICB9XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhjb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxQdWxsSW50b0Rlc2NyaXB0b3JGcm9tUXVldWUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1bGxJbnRvRGVzY3JpcHRvcjogUHVsbEludG9EZXNjcmlwdG9yKSB7XG4gIGNvbnN0IG1heEJ5dGVzVG9Db3B5ID0gTWF0aC5taW4oY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVMZW5ndGggLSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQpO1xuICBjb25zdCBtYXhCeXRlc0ZpbGxlZCA9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCArIG1heEJ5dGVzVG9Db3B5O1xuXG4gIGxldCB0b3RhbEJ5dGVzVG9Db3B5UmVtYWluaW5nID0gbWF4Qnl0ZXNUb0NvcHk7XG4gIGxldCByZWFkeSA9IGZhbHNlO1xuICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkIDwgcHVsbEludG9EZXNjcmlwdG9yLm1pbmltdW1GaWxsKTtcbiAgY29uc3QgcmVtYWluZGVyQnl0ZXMgPSBtYXhCeXRlc0ZpbGxlZCAlIHB1bGxJbnRvRGVzY3JpcHRvci5lbGVtZW50U2l6ZTtcbiAgY29uc3QgbWF4QWxpZ25lZEJ5dGVzID0gbWF4Qnl0ZXNGaWxsZWQgLSByZW1haW5kZXJCeXRlcztcbiAgLy8gQSBkZXNjcmlwdG9yIGZvciBhIHJlYWQoKSByZXF1ZXN0IHRoYXQgaXMgbm90IHlldCBmaWxsZWQgdXAgdG8gaXRzIG1pbmltdW0gbGVuZ3RoIHdpbGwgc3RheSBhdCB0aGUgaGVhZFxuICAvLyBvZiB0aGUgcXVldWUsIHNvIHRoZSB1bmRlcmx5aW5nIHNvdXJjZSBjYW4ga2VlcCBmaWxsaW5nIGl0LlxuICBpZiAobWF4QWxpZ25lZEJ5dGVzID49IHB1bGxJbnRvRGVzY3JpcHRvci5taW5pbXVtRmlsbCkge1xuICAgIHRvdGFsQnl0ZXNUb0NvcHlSZW1haW5pbmcgPSBtYXhBbGlnbmVkQnl0ZXMgLSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQ7XG4gICAgcmVhZHkgPSB0cnVlO1xuICB9XG5cbiAgY29uc3QgcXVldWUgPSBjb250cm9sbGVyLl9xdWV1ZTtcblxuICB3aGlsZSAodG90YWxCeXRlc1RvQ29weVJlbWFpbmluZyA+IDApIHtcbiAgICBjb25zdCBoZWFkT2ZRdWV1ZSA9IHF1ZXVlLnBlZWsoKTtcblxuICAgIGNvbnN0IGJ5dGVzVG9Db3B5ID0gTWF0aC5taW4odG90YWxCeXRlc1RvQ29weVJlbWFpbmluZywgaGVhZE9mUXVldWUuYnl0ZUxlbmd0aCk7XG5cbiAgICBjb25zdCBkZXN0U3RhcnQgPSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZU9mZnNldCArIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZDtcbiAgICBDb3B5RGF0YUJsb2NrQnl0ZXMocHVsbEludG9EZXNjcmlwdG9yLmJ1ZmZlciwgZGVzdFN0YXJ0LCBoZWFkT2ZRdWV1ZS5idWZmZXIsIGhlYWRPZlF1ZXVlLmJ5dGVPZmZzZXQsIGJ5dGVzVG9Db3B5KTtcblxuICAgIGlmIChoZWFkT2ZRdWV1ZS5ieXRlTGVuZ3RoID09PSBieXRlc1RvQ29weSkge1xuICAgICAgcXVldWUuc2hpZnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZE9mUXVldWUuYnl0ZU9mZnNldCArPSBieXRlc1RvQ29weTtcbiAgICAgIGhlYWRPZlF1ZXVlLmJ5dGVMZW5ndGggLT0gYnl0ZXNUb0NvcHk7XG4gICAgfVxuICAgIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplIC09IGJ5dGVzVG9Db3B5O1xuXG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxIZWFkUHVsbEludG9EZXNjcmlwdG9yKGNvbnRyb2xsZXIsIGJ5dGVzVG9Db3B5LCBwdWxsSW50b0Rlc2NyaXB0b3IpO1xuXG4gICAgdG90YWxCeXRlc1RvQ29weVJlbWFpbmluZyAtPSBieXRlc1RvQ29weTtcbiAgfVxuXG4gIGlmICghcmVhZHkpIHtcbiAgICBhc3NlcnQoY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPT09IDApO1xuICAgIGFzc2VydChwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgPiAwKTtcbiAgICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkIDwgcHVsbEludG9EZXNjcmlwdG9yLm1pbmltdW1GaWxsKTtcbiAgfVxuXG4gIHJldHVybiByZWFkeTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxIZWFkUHVsbEludG9EZXNjcmlwdG9yKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1bGxJbnRvRGVzY3JpcHRvcjogUHVsbEludG9EZXNjcmlwdG9yKSB7XG4gIGFzc2VydChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA9PT0gMCB8fCBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKSA9PT0gcHVsbEludG9EZXNjcmlwdG9yKTtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID09PSBudWxsKTtcbiAgcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICs9IHNpemU7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJIYW5kbGVRdWV1ZURyYWluKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIpIHtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnKTtcblxuICBpZiAoY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPT09IDAgJiYgY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQpIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuICAgIFJlYWRhYmxlU3RyZWFtQ2xvc2UoY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbSk7XG4gIH0gZWxzZSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckludmFsaWRhdGVCWU9CUmVxdWVzdChjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIGlmIChjb250cm9sbGVyLl9ieW9iUmVxdWVzdCA9PT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0Ll9hc3NvY2lhdGVkUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlciA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0Ll92aWV3ID0gbnVsbCE7XG4gIGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclByb2Nlc3NQdWxsSW50b0Rlc2NyaXB0b3JzVXNpbmdRdWV1ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIGFzc2VydCghY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQpO1xuXG4gIHdoaWxlIChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwdWxsSW50b0Rlc2NyaXB0b3IgPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLnJlYWRlclR5cGUgIT09ICdub25lJyk7XG5cbiAgICBpZiAoUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxQdWxsSW50b0Rlc2NyaXB0b3JGcm9tUXVldWUoY29udHJvbGxlciwgcHVsbEludG9EZXNjcmlwdG9yKSkge1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNoaWZ0UGVuZGluZ1B1bGxJbnRvKGNvbnRyb2xsZXIpO1xuXG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ29tbWl0UHVsbEludG9EZXNjcmlwdG9yKFxuICAgICAgICBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLFxuICAgICAgICBwdWxsSW50b0Rlc2NyaXB0b3JcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQcm9jZXNzUmVhZFJlcXVlc3RzVXNpbmdRdWV1ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIGNvbnN0IHJlYWRlciA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3JlYWRlcjtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyKHJlYWRlcikpO1xuICB3aGlsZSAocmVhZGVyLl9yZWFkUmVxdWVzdHMubGVuZ3RoID4gMCkge1xuICAgIGlmIChjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByZWFkUmVxdWVzdCA9IHJlYWRlci5fcmVhZFJlcXVlc3RzLnNoaWZ0KCk7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxSZWFkUmVxdWVzdEZyb21RdWV1ZShjb250cm9sbGVyLCByZWFkUmVxdWVzdCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQdWxsSW50bzxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+KFxuICBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICB2aWV3OiBULFxuICBtaW46IG51bWJlcixcbiAgcmVhZEludG9SZXF1ZXN0OiBSZWFkSW50b1JlcXVlc3Q8VD5cbik6IHZvaWQge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGNvbnN0IGN0b3IgPSB2aWV3LmNvbnN0cnVjdG9yIGFzIEFycmF5QnVmZmVyVmlld0NvbnN0cnVjdG9yPFQ+O1xuICBjb25zdCBlbGVtZW50U2l6ZSA9IGFycmF5QnVmZmVyVmlld0VsZW1lbnRTaXplKGN0b3IpO1xuXG4gIGNvbnN0IHsgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCB9ID0gdmlldztcblxuICBjb25zdCBtaW5pbXVtRmlsbCA9IG1pbiAqIGVsZW1lbnRTaXplO1xuICBhc3NlcnQobWluaW11bUZpbGwgPj0gZWxlbWVudFNpemUgJiYgbWluaW11bUZpbGwgPD0gYnl0ZUxlbmd0aCk7XG4gIGFzc2VydChtaW5pbXVtRmlsbCAlIGVsZW1lbnRTaXplID09PSAwKTtcblxuICBsZXQgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbiAgdHJ5IHtcbiAgICBidWZmZXIgPSBUcmFuc2ZlckFycmF5QnVmZmVyKHZpZXcuYnVmZmVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlYWRJbnRvUmVxdWVzdC5fZXJyb3JTdGVwcyhlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwdWxsSW50b0Rlc2NyaXB0b3I6IEJZT0JQdWxsSW50b0Rlc2NyaXB0b3I8VD4gPSB7XG4gICAgYnVmZmVyLFxuICAgIGJ1ZmZlckJ5dGVMZW5ndGg6IGJ1ZmZlci5ieXRlTGVuZ3RoLFxuICAgIGJ5dGVPZmZzZXQsXG4gICAgYnl0ZUxlbmd0aCxcbiAgICBieXRlc0ZpbGxlZDogMCxcbiAgICBtaW5pbXVtRmlsbCxcbiAgICBlbGVtZW50U2l6ZSxcbiAgICB2aWV3Q29uc3RydWN0b3I6IGN0b3IsXG4gICAgcmVhZGVyVHlwZTogJ2J5b2InXG4gIH07XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucHVzaChwdWxsSW50b0Rlc2NyaXB0b3IpO1xuXG4gICAgLy8gTm8gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoKSBjYWxsIHNpbmNlOlxuICAgIC8vIC0gTm8gY2hhbmdlIGhhcHBlbnMgb24gZGVzaXJlZFNpemVcbiAgICAvLyAtIFRoZSBzb3VyY2UgaGFzIGFscmVhZHkgYmVlbiBub3RpZmllZCBvZiB0aGF0IHRoZXJlJ3MgYXQgbGVhc3QgMSBwZW5kaW5nIHJlYWQodmlldylcblxuICAgIFJlYWRhYmxlU3RyZWFtQWRkUmVhZEludG9SZXF1ZXN0KHN0cmVhbSwgcmVhZEludG9SZXF1ZXN0KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoc3RyZWFtLl9zdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICBjb25zdCBlbXB0eVZpZXcgPSBuZXcgY3RvcihwdWxsSW50b0Rlc2NyaXB0b3IuYnVmZmVyLCBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZU9mZnNldCwgMCk7XG4gICAgcmVhZEludG9SZXF1ZXN0Ll9jbG9zZVN0ZXBzKGVtcHR5Vmlldyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID4gMCkge1xuICAgIGlmIChSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbFB1bGxJbnRvRGVzY3JpcHRvckZyb21RdWV1ZShjb250cm9sbGVyLCBwdWxsSW50b0Rlc2NyaXB0b3IpKSB7XG4gICAgICBjb25zdCBmaWxsZWRWaWV3ID0gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNvbnZlcnRQdWxsSW50b0Rlc2NyaXB0b3I8VD4ocHVsbEludG9EZXNjcmlwdG9yKTtcblxuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckhhbmRsZVF1ZXVlRHJhaW4oY29udHJvbGxlcik7XG5cbiAgICAgIHJlYWRJbnRvUmVxdWVzdC5fY2h1bmtTdGVwcyhmaWxsZWRWaWV3KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQpIHtcbiAgICAgIGNvbnN0IGUgPSBuZXcgVHlwZUVycm9yKCdJbnN1ZmZpY2llbnQgYnl0ZXMgdG8gZmlsbCBlbGVtZW50cyBpbiB0aGUgZ2l2ZW4gYnVmZmVyJyk7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgZSk7XG5cbiAgICAgIHJlYWRJbnRvUmVxdWVzdC5fZXJyb3JTdGVwcyhlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnB1c2gocHVsbEludG9EZXNjcmlwdG9yKTtcblxuICBSZWFkYWJsZVN0cmVhbUFkZFJlYWRJbnRvUmVxdWVzdDxUPihzdHJlYW0sIHJlYWRJbnRvUmVxdWVzdCk7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKGNvbnRyb2xsZXIpO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZEluQ2xvc2VkU3RhdGUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdERlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcikge1xuICBhc3NlcnQoZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICUgZmlyc3REZXNjcmlwdG9yLmVsZW1lbnRTaXplID09PSAwKTtcblxuICBpZiAoZmlyc3REZXNjcmlwdG9yLnJlYWRlclR5cGUgPT09ICdub25lJykge1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhjb250cm9sbGVyKTtcbiAgfVxuXG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW07XG4gIGlmIChSZWFkYWJsZVN0cmVhbUhhc0JZT0JSZWFkZXIoc3RyZWFtKSkge1xuICAgIHdoaWxlIChSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRJbnRvUmVxdWVzdHMoc3RyZWFtKSA+IDApIHtcbiAgICAgIGNvbnN0IHB1bGxJbnRvRGVzY3JpcHRvciA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhjb250cm9sbGVyKTtcbiAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb21taXRQdWxsSW50b0Rlc2NyaXB0b3Ioc3RyZWFtLCBwdWxsSW50b0Rlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZEluUmVhZGFibGVTdGF0ZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZXNXcml0dGVuOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdWxsSW50b0Rlc2NyaXB0b3I6IFB1bGxJbnRvRGVzY3JpcHRvcikge1xuICBhc3NlcnQocHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICsgYnl0ZXNXcml0dGVuIDw9IHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlTGVuZ3RoKTtcblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRmlsbEhlYWRQdWxsSW50b0Rlc2NyaXB0b3IoY29udHJvbGxlciwgYnl0ZXNXcml0dGVuLCBwdWxsSW50b0Rlc2NyaXB0b3IpO1xuXG4gIGlmIChwdWxsSW50b0Rlc2NyaXB0b3IucmVhZGVyVHlwZSA9PT0gJ25vbmUnKSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWVEZXRhY2hlZFB1bGxJbnRvVG9RdWV1ZShjb250cm9sbGVyLCBwdWxsSW50b0Rlc2NyaXB0b3IpO1xuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJQcm9jZXNzUHVsbEludG9EZXNjcmlwdG9yc1VzaW5nUXVldWUoY29udHJvbGxlcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZCA8IHB1bGxJbnRvRGVzY3JpcHRvci5taW5pbXVtRmlsbCkge1xuICAgIC8vIEEgZGVzY3JpcHRvciBmb3IgYSByZWFkKCkgcmVxdWVzdCB0aGF0IGlzIG5vdCB5ZXQgZmlsbGVkIHVwIHRvIGl0cyBtaW5pbXVtIGxlbmd0aCB3aWxsIHN0YXkgYXQgdGhlIGhlYWRcbiAgICAvLyBvZiB0aGUgcXVldWUsIHNvIHRoZSB1bmRlcmx5aW5nIHNvdXJjZSBjYW4ga2VlcCBmaWxsaW5nIGl0LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhjb250cm9sbGVyKTtcblxuICBjb25zdCByZW1haW5kZXJTaXplID0gcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICUgcHVsbEludG9EZXNjcmlwdG9yLmVsZW1lbnRTaXplO1xuICBpZiAocmVtYWluZGVyU2l6ZSA+IDApIHtcbiAgICBjb25zdCBlbmQgPSBwdWxsSW50b0Rlc2NyaXB0b3IuYnl0ZU9mZnNldCArIHB1bGxJbnRvRGVzY3JpcHRvci5ieXRlc0ZpbGxlZDtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNsb25lZENodW5rVG9RdWV1ZShcbiAgICAgIGNvbnRyb2xsZXIsXG4gICAgICBwdWxsSW50b0Rlc2NyaXB0b3IuYnVmZmVyLFxuICAgICAgZW5kIC0gcmVtYWluZGVyU2l6ZSxcbiAgICAgIHJlbWFpbmRlclNpemVcbiAgICApO1xuICB9XG5cbiAgcHVsbEludG9EZXNjcmlwdG9yLmJ5dGVzRmlsbGVkIC09IHJlbWFpbmRlclNpemU7XG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDb21taXRQdWxsSW50b0Rlc2NyaXB0b3IoY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbSwgcHVsbEludG9EZXNjcmlwdG9yKTtcblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHJvY2Vzc1B1bGxJbnRvRGVzY3JpcHRvcnNVc2luZ1F1ZXVlKGNvbnRyb2xsZXIpO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZEludGVybmFsKGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsIGJ5dGVzV3JpdHRlbjogbnVtYmVyKSB7XG4gIGNvbnN0IGZpcnN0RGVzY3JpcHRvciA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MucGVlaygpO1xuICBhc3NlcnQoQ2FuVHJhbnNmZXJBcnJheUJ1ZmZlcihmaXJzdERlc2NyaXB0b3IuYnVmZmVyKSk7XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckludmFsaWRhdGVCWU9CUmVxdWVzdChjb250cm9sbGVyKTtcblxuICBjb25zdCBzdGF0ZSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlO1xuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgYXNzZXJ0KGJ5dGVzV3JpdHRlbiA9PT0gMCk7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJbkNsb3NlZFN0YXRlKGNvbnRyb2xsZXIsIGZpcnN0RGVzY3JpcHRvcik7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KHN0YXRlID09PSAncmVhZGFibGUnKTtcbiAgICBhc3NlcnQoYnl0ZXNXcml0dGVuID4gMCk7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJblJlYWRhYmxlU3RhdGUoY29udHJvbGxlciwgYnl0ZXNXcml0dGVuLCBmaXJzdERlc2NyaXB0b3IpO1xuICB9XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJTaGlmdFBlbmRpbmdQdWxsSW50byhcbiAgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclxuKTogUHVsbEludG9EZXNjcmlwdG9yIHtcbiAgYXNzZXJ0KGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID09PSBudWxsKTtcbiAgY29uc3QgZGVzY3JpcHRvciA9IGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3Muc2hpZnQoKSE7XG4gIHJldHVybiBkZXNjcmlwdG9yO1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyU2hvdWxkQ2FsbFB1bGwoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcik6IGJvb2xlYW4ge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFjb250cm9sbGVyLl9zdGFydGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKFJlYWRhYmxlU3RyZWFtSGFzRGVmYXVsdFJlYWRlcihzdHJlYW0pICYmIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzKHN0cmVhbSkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoUmVhZGFibGVTdHJlYW1IYXNCWU9CUmVhZGVyKHN0cmVhbSkgJiYgUmVhZGFibGVTdHJlYW1HZXROdW1SZWFkSW50b1JlcXVlc3RzKHN0cmVhbSkgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjb25zdCBkZXNpcmVkU2l6ZSA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShjb250cm9sbGVyKTtcbiAgYXNzZXJ0KGRlc2lyZWRTaXplICE9PSBudWxsKTtcbiAgaWYgKGRlc2lyZWRTaXplISA+IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIGNvbnRyb2xsZXIuX3B1bGxBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xufVxuXG4vLyBBIGNsaWVudCBvZiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyIG1heSB1c2UgdGhlc2UgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIGJ5cGFzcyBzdGF0ZSBjaGVjay5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZShjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW07XG5cbiAgaWYgKGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkIHx8IHN0cmVhbS5fc3RhdGUgIT09ICdyZWFkYWJsZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPiAwKSB7XG4gICAgY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgPSB0cnVlO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGZpcnN0UGVuZGluZ1B1bGxJbnRvID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gICAgaWYgKGZpcnN0UGVuZGluZ1B1bGxJbnRvLmJ5dGVzRmlsbGVkICUgZmlyc3RQZW5kaW5nUHVsbEludG8uZWxlbWVudFNpemUgIT09IDApIHtcbiAgICAgIGNvbnN0IGUgPSBuZXcgVHlwZUVycm9yKCdJbnN1ZmZpY2llbnQgYnl0ZXMgdG8gZmlsbCBlbGVtZW50cyBpbiB0aGUgZ2l2ZW4gYnVmZmVyJyk7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgZSk7XG5cbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgUmVhZGFibGVTdHJlYW1DbG9zZShzdHJlYW0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVucXVldWUoXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gIGNodW5rOiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3PlxuKSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW07XG5cbiAgaWYgKGNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkIHx8IHN0cmVhbS5fc3RhdGUgIT09ICdyZWFkYWJsZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IGJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCB9ID0gY2h1bms7XG4gIGlmIChJc0RldGFjaGVkQnVmZmVyKGJ1ZmZlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjaHVua1xcJ3MgYnVmZmVyIGlzIGRldGFjaGVkIGFuZCBzbyBjYW5ub3QgYmUgZW5xdWV1ZWQnKTtcbiAgfVxuICBjb25zdCB0cmFuc2ZlcnJlZEJ1ZmZlciA9IFRyYW5zZmVyQXJyYXlCdWZmZXIoYnVmZmVyKTtcblxuICBpZiAoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZmlyc3RQZW5kaW5nUHVsbEludG8gPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcihmaXJzdFBlbmRpbmdQdWxsSW50by5idWZmZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnVGhlIEJZT0IgcmVxdWVzdFxcJ3MgYnVmZmVyIGhhcyBiZWVuIGRldGFjaGVkIGFuZCBzbyBjYW5ub3QgYmUgZmlsbGVkIHdpdGggYW4gZW5xdWV1ZWQgY2h1bmsnXG4gICAgICApO1xuICAgIH1cbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVySW52YWxpZGF0ZUJZT0JSZXF1ZXN0KGNvbnRyb2xsZXIpO1xuICAgIGZpcnN0UGVuZGluZ1B1bGxJbnRvLmJ1ZmZlciA9IFRyYW5zZmVyQXJyYXlCdWZmZXIoZmlyc3RQZW5kaW5nUHVsbEludG8uYnVmZmVyKTtcbiAgICBpZiAoZmlyc3RQZW5kaW5nUHVsbEludG8ucmVhZGVyVHlwZSA9PT0gJ25vbmUnKSB7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZURldGFjaGVkUHVsbEludG9Ub1F1ZXVlKGNvbnRyb2xsZXIsIGZpcnN0UGVuZGluZ1B1bGxJbnRvKTtcbiAgICB9XG4gIH1cblxuICBpZiAoUmVhZGFibGVTdHJlYW1IYXNEZWZhdWx0UmVhZGVyKHN0cmVhbSkpIHtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHJvY2Vzc1JlYWRSZXF1ZXN0c1VzaW5nUXVldWUoY29udHJvbGxlcik7XG4gICAgaWYgKFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzKHN0cmVhbSkgPT09IDApIHtcbiAgICAgIGFzc2VydChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA9PT0gMCk7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNodW5rVG9RdWV1ZShjb250cm9sbGVyLCB0cmFuc2ZlcnJlZEJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2VydChjb250cm9sbGVyLl9xdWV1ZS5sZW5ndGggPT09IDApO1xuICAgICAgaWYgKGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3NlcnQoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCkucmVhZGVyVHlwZSA9PT0gJ2RlZmF1bHQnKTtcbiAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclNoaWZ0UGVuZGluZ1B1bGxJbnRvKGNvbnRyb2xsZXIpO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhbnNmZXJyZWRWaWV3ID0gbmV3IFVpbnQ4QXJyYXkodHJhbnNmZXJyZWRCdWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpO1xuICAgICAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3Qoc3RyZWFtLCB0cmFuc2ZlcnJlZFZpZXcgYXMgTm9uU2hhcmVkPFVpbnQ4QXJyYXk+LCBmYWxzZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKFJlYWRhYmxlU3RyZWFtSGFzQllPQlJlYWRlcihzdHJlYW0pKSB7XG4gICAgLy8gVE9ETzogSWRlYWxseSBpbiB0aGlzIGJyYW5jaCBkZXRhY2hpbmcgc2hvdWxkIGhhcHBlbiBvbmx5IGlmIHRoZSBidWZmZXIgaXMgbm90IGNvbnN1bWVkIGZ1bGx5LlxuICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlQ2h1bmtUb1F1ZXVlKGNvbnRyb2xsZXIsIHRyYW5zZmVycmVkQnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHJvY2Vzc1B1bGxJbnRvRGVzY3JpcHRvcnNVc2luZ1F1ZXVlKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydCghSXNSZWFkYWJsZVN0cmVhbUxvY2tlZChzdHJlYW0pKTtcbiAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZUNodW5rVG9RdWV1ZShjb250cm9sbGVyLCB0cmFuc2ZlcnJlZEJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCk7XG4gIH1cblxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLCBlOiBhbnkpIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlQnl0ZVN0cmVhbTtcblxuICBpZiAoc3RyZWFtLl9zdGF0ZSAhPT0gJ3JlYWRhYmxlJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbGVhclBlbmRpbmdQdWxsSW50b3MoY29udHJvbGxlcik7XG5cbiAgUmVzZXRRdWV1ZShjb250cm9sbGVyKTtcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgUmVhZGFibGVTdHJlYW1FcnJvcihzdHJlYW0sIGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckZpbGxSZWFkUmVxdWVzdEZyb21RdWV1ZShcbiAgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgcmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PE5vblNoYXJlZDxVaW50OEFycmF5Pj5cbikge1xuICBhc3NlcnQoY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPiAwKTtcblxuICBjb25zdCBlbnRyeSA9IGNvbnRyb2xsZXIuX3F1ZXVlLnNoaWZ0KCk7XG4gIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplIC09IGVudHJ5LmJ5dGVMZW5ndGg7XG5cbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckhhbmRsZVF1ZXVlRHJhaW4oY29udHJvbGxlcik7XG5cbiAgY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KGVudHJ5LmJ1ZmZlciwgZW50cnkuYnl0ZU9mZnNldCwgZW50cnkuYnl0ZUxlbmd0aCk7XG4gIHJlYWRSZXF1ZXN0Ll9jaHVua1N0ZXBzKHZpZXcgYXMgTm9uU2hhcmVkPFVpbnQ4QXJyYXk+KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXRCWU9CUmVxdWVzdChcbiAgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclxuKTogUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCB8IG51bGwge1xuICBpZiAoY29udHJvbGxlci5fYnlvYlJlcXVlc3QgPT09IG51bGwgJiYgY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZmlyc3REZXNjcmlwdG9yID0gY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5wZWVrKCk7XG4gICAgY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KGZpcnN0RGVzY3JpcHRvci5idWZmZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RGVzY3JpcHRvci5ieXRlT2Zmc2V0ICsgZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdERlc2NyaXB0b3IuYnl0ZUxlbmd0aCAtIGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCk7XG5cbiAgICBjb25zdCBieW9iUmVxdWVzdDogUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCA9IE9iamVjdC5jcmVhdGUoUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC5wcm90b3R5cGUpO1xuICAgIFNldFVwUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdChieW9iUmVxdWVzdCwgY29udHJvbGxlciwgdmlldyBhcyBOb25TaGFyZWQ8VWludDhBcnJheT4pO1xuICAgIGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0ID0gYnlvYlJlcXVlc3Q7XG4gIH1cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX2J5b2JSZXF1ZXN0O1xufVxuXG5mdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0RGVzaXJlZFNpemUoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcik6IG51bWJlciB8IG51bGwge1xuICBjb25zdCBzdGF0ZSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRSZWFkYWJsZUJ5dGVTdHJlYW0uX3N0YXRlO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXIuX3N0cmF0ZWd5SFdNIC0gY29udHJvbGxlci5fcXVldWVUb3RhbFNpemU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZChjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLCBieXRlc1dyaXR0ZW46IG51bWJlcikge1xuICBhc3NlcnQoY29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKTtcblxuICBjb25zdCBmaXJzdERlc2NyaXB0b3IgPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgY29uc3Qgc3RhdGUgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgaWYgKGJ5dGVzV3JpdHRlbiAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYnl0ZXNXcml0dGVuIG11c3QgYmUgMCB3aGVuIGNhbGxpbmcgcmVzcG9uZCgpIG9uIGEgY2xvc2VkIHN0cmVhbScpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuICAgIGlmIChieXRlc1dyaXR0ZW4gPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2J5dGVzV3JpdHRlbiBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwIHdoZW4gY2FsbGluZyByZXNwb25kKCkgb24gYSByZWFkYWJsZSBzdHJlYW0nKTtcbiAgICB9XG4gICAgaWYgKGZpcnN0RGVzY3JpcHRvci5ieXRlc0ZpbGxlZCArIGJ5dGVzV3JpdHRlbiA+IGZpcnN0RGVzY3JpcHRvci5ieXRlTGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignYnl0ZXNXcml0dGVuIG91dCBvZiByYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIGZpcnN0RGVzY3JpcHRvci5idWZmZXIgPSBUcmFuc2ZlckFycmF5QnVmZmVyKGZpcnN0RGVzY3JpcHRvci5idWZmZXIpO1xuXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kSW50ZXJuYWwoY29udHJvbGxlciwgYnl0ZXNXcml0dGVuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kV2l0aE5ld1ZpZXcoY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXc6IE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+KSB7XG4gIGFzc2VydChjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApO1xuICBhc3NlcnQoIUlzRGV0YWNoZWRCdWZmZXIodmlldy5idWZmZXIpKTtcblxuICBjb25zdCBmaXJzdERlc2NyaXB0b3IgPSBjb250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLnBlZWsoKTtcbiAgY29uc3Qgc3RhdGUgPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgaWYgKHZpZXcuYnl0ZUxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHZpZXdcXCdzIGxlbmd0aCBtdXN0IGJlIDAgd2hlbiBjYWxsaW5nIHJlc3BvbmRXaXRoTmV3VmlldygpIG9uIGEgY2xvc2VkIHN0cmVhbScpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQoc3RhdGUgPT09ICdyZWFkYWJsZScpO1xuICAgIGlmICh2aWV3LmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdUaGUgdmlld1xcJ3MgbGVuZ3RoIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAgd2hlbiBjYWxsaW5nIHJlc3BvbmRXaXRoTmV3VmlldygpIG9uIGEgcmVhZGFibGUgc3RyZWFtJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZmlyc3REZXNjcmlwdG9yLmJ5dGVPZmZzZXQgKyBmaXJzdERlc2NyaXB0b3IuYnl0ZXNGaWxsZWQgIT09IHZpZXcuYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgcmVnaW9uIHNwZWNpZmllZCBieSB2aWV3IGRvZXMgbm90IG1hdGNoIGJ5b2JSZXF1ZXN0Jyk7XG4gIH1cbiAgaWYgKGZpcnN0RGVzY3JpcHRvci5idWZmZXJCeXRlTGVuZ3RoICE9PSB2aWV3LmJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSBidWZmZXIgb2YgdmlldyBoYXMgZGlmZmVyZW50IGNhcGFjaXR5IHRoYW4gYnlvYlJlcXVlc3QnKTtcbiAgfVxuICBpZiAoZmlyc3REZXNjcmlwdG9yLmJ5dGVzRmlsbGVkICsgdmlldy5ieXRlTGVuZ3RoID4gZmlyc3REZXNjcmlwdG9yLmJ5dGVMZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHJlZ2lvbiBzcGVjaWZpZWQgYnkgdmlldyBpcyBsYXJnZXIgdGhhbiBieW9iUmVxdWVzdCcpO1xuICB9XG5cbiAgY29uc3Qgdmlld0J5dGVMZW5ndGggPSB2aWV3LmJ5dGVMZW5ndGg7XG4gIGZpcnN0RGVzY3JpcHRvci5idWZmZXIgPSBUcmFuc2ZlckFycmF5QnVmZmVyKHZpZXcuYnVmZmVyKTtcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmRJbnRlcm5hbChjb250cm9sbGVyLCB2aWV3Qnl0ZUxlbmd0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXRVcFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1bGxBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9BbGxvY2F0ZUNodW5rU2l6ZTogbnVtYmVyIHwgdW5kZWZpbmVkKSB7XG4gIGFzc2VydChzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciA9PT0gdW5kZWZpbmVkKTtcbiAgaWYgKGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYXNzZXJ0KE51bWJlcklzSW50ZWdlcihhdXRvQWxsb2NhdGVDaHVua1NpemUpKTtcbiAgICBhc3NlcnQoYXV0b0FsbG9jYXRlQ2h1bmtTaXplID4gMCk7XG4gIH1cblxuICBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVCeXRlU3RyZWFtID0gc3RyZWFtO1xuXG4gIGNvbnRyb2xsZXIuX3B1bGxBZ2FpbiA9IGZhbHNlO1xuICBjb250cm9sbGVyLl9wdWxsaW5nID0gZmFsc2U7XG5cbiAgY29udHJvbGxlci5fYnlvYlJlcXVlc3QgPSBudWxsO1xuXG4gIC8vIE5lZWQgdG8gc2V0IHRoZSBzbG90cyBzbyB0aGF0IHRoZSBhc3NlcnQgZG9lc24ndCBmaXJlLiBJbiB0aGUgc3BlYyB0aGUgc2xvdHMgYWxyZWFkeSBleGlzdCBpbXBsaWNpdGx5LlxuICBjb250cm9sbGVyLl9xdWV1ZSA9IGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplID0gdW5kZWZpbmVkITtcbiAgUmVzZXRRdWV1ZShjb250cm9sbGVyKTtcblxuICBjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCA9IGZhbHNlO1xuICBjb250cm9sbGVyLl9zdGFydGVkID0gZmFsc2U7XG5cbiAgY29udHJvbGxlci5fc3RyYXRlZ3lIV00gPSBoaWdoV2F0ZXJNYXJrO1xuXG4gIGNvbnRyb2xsZXIuX3B1bGxBbGdvcml0aG0gPSBwdWxsQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0gPSBjYW5jZWxBbGdvcml0aG07XG5cbiAgY29udHJvbGxlci5fYXV0b0FsbG9jYXRlQ2h1bmtTaXplID0gYXV0b0FsbG9jYXRlQ2h1bmtTaXplO1xuXG4gIGNvbnRyb2xsZXIuX3BlbmRpbmdQdWxsSW50b3MgPSBuZXcgU2ltcGxlUXVldWUoKTtcblxuICBzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG5cbiAgY29uc3Qgc3RhcnRSZXN1bHQgPSBzdGFydEFsZ29yaXRobSgpO1xuICB1cG9uUHJvbWlzZShcbiAgICBwcm9taXNlUmVzb2x2ZWRXaXRoKHN0YXJ0UmVzdWx0KSxcbiAgICAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLl9zdGFydGVkID0gdHJ1ZTtcblxuICAgICAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsaW5nKTtcbiAgICAgIGFzc2VydCghY29udHJvbGxlci5fcHVsbEFnYWluKTtcblxuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIHIgPT4ge1xuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIHIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2UoXG4gIHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtLFxuICB1bmRlcmx5aW5nQnl0ZVNvdXJjZTogVmFsaWRhdGVkVW5kZXJseWluZ0J5dGVTb3VyY2UsXG4gIGhpZ2hXYXRlck1hcms6IG51bWJlclxuKSB7XG4gIGNvbnN0IGNvbnRyb2xsZXI6IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIgPSBPYmplY3QuY3JlYXRlKFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuICBsZXQgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPjtcbiAgbGV0IHB1bGxBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGxldCBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBpZiAodW5kZXJseWluZ0J5dGVTb3VyY2Uuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZXJseWluZ0J5dGVTb3VyY2Uuc3RhcnQhKGNvbnRyb2xsZXIpO1xuICB9IGVsc2Uge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZWZpbmVkO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nQnl0ZVNvdXJjZS5wdWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICBwdWxsQWxnb3JpdGhtID0gKCkgPT4gdW5kZXJseWluZ0J5dGVTb3VyY2UucHVsbCEoY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgcHVsbEFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBpZiAodW5kZXJseWluZ0J5dGVTb3VyY2UuY2FuY2VsICE9PSB1bmRlZmluZWQpIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSByZWFzb24gPT4gdW5kZXJseWluZ0J5dGVTb3VyY2UuY2FuY2VsIShyZWFzb24pO1xuICB9IGVsc2Uge1xuICAgIGNhbmNlbEFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIGNvbnN0IGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSA9IHVuZGVybHlpbmdCeXRlU291cmNlLmF1dG9BbGxvY2F0ZUNodW5rU2l6ZTtcbiAgaWYgKGF1dG9BbGxvY2F0ZUNodW5rU2l6ZSA9PT0gMCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2F1dG9BbGxvY2F0ZUNodW5rU2l6ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwJyk7XG4gIH1cblxuICBTZXRVcFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoXG4gICAgc3RyZWFtLCBjb250cm9sbGVyLCBzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCBoaWdoV2F0ZXJNYXJrLCBhdXRvQWxsb2NhdGVDaHVua1NpemVcbiAgKTtcbn1cblxuZnVuY3Rpb24gU2V0VXBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0KHJlcXVlc3Q6IFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3OiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3Pikge1xuICBhc3NlcnQoSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKGNvbnRyb2xsZXIpKTtcbiAgYXNzZXJ0KHR5cGVvZiB2aWV3ID09PSAnb2JqZWN0Jyk7XG4gIGFzc2VydChBcnJheUJ1ZmZlci5pc1ZpZXcodmlldykpO1xuICBhc3NlcnQoIUlzRGV0YWNoZWRCdWZmZXIodmlldy5idWZmZXIpKTtcbiAgcmVxdWVzdC5fYXNzb2NpYXRlZFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICByZXF1ZXN0Ll92aWV3ID0gdmlldztcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtQllPQlJlcXVlc3QuXG5cbmZ1bmN0aW9uIGJ5b2JSZXF1ZXN0QnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdC5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdGApO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlci5cblxuZnVuY3Rpb24gYnl0ZVN0cmVhbUNvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKFxuICAgIGBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyYCk7XG59XG4iLCAiaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSwgY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlIH0gZnJvbSAnLi9iYXNpYyc7XG5pbXBvcnQgdHlwZSB7XG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zLFxuICBSZWFkYWJsZVN0cmVhbUdldFJlYWRlck9wdGlvbnMsXG4gIFZhbGlkYXRlZFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zXG59IGZyb20gJy4uL3JlYWRhYmxlLXN0cmVhbS9yZWFkZXItb3B0aW9ucyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UmVhZGVyT3B0aW9ucyhvcHRpb25zOiBSZWFkYWJsZVN0cmVhbUdldFJlYWRlck9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFJlYWRhYmxlU3RyZWFtR2V0UmVhZGVyT3B0aW9ucyB7XG4gIGFzc2VydERpY3Rpb25hcnkob3B0aW9ucywgY29udGV4dCk7XG4gIGNvbnN0IG1vZGUgPSBvcHRpb25zPy5tb2RlO1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGNvbnZlcnRSZWFkYWJsZVN0cmVhbVJlYWRlck1vZGUobW9kZSwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnbW9kZScgdGhhdGApXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRSZWFkYWJsZVN0cmVhbVJlYWRlck1vZGUobW9kZTogc3RyaW5nLCBjb250ZXh0OiBzdHJpbmcpOiAnYnlvYicge1xuICBtb2RlID0gYCR7bW9kZX1gO1xuICBpZiAobW9kZSAhPT0gJ2J5b2InKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtjb250ZXh0fSAnJHttb2RlfScgaXMgbm90IGEgdmFsaWQgZW51bWVyYXRpb24gdmFsdWUgZm9yIFJlYWRhYmxlU3RyZWFtUmVhZGVyTW9kZWApO1xuICB9XG4gIHJldHVybiBtb2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydEJ5b2JSZWFkT3B0aW9ucyhcbiAgb3B0aW9uczogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkLFxuICBjb250ZXh0OiBzdHJpbmdcbik6IFZhbGlkYXRlZFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zIHtcbiAgYXNzZXJ0RGljdGlvbmFyeShvcHRpb25zLCBjb250ZXh0KTtcbiAgY29uc3QgbWluID0gb3B0aW9ucz8ubWluID8/IDE7XG4gIHJldHVybiB7XG4gICAgbWluOiBjb252ZXJ0VW5zaWduZWRMb25nTG9uZ1dpdGhFbmZvcmNlUmFuZ2UoXG4gICAgICBtaW4sXG4gICAgICBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdtaW4nIHRoYXRgXG4gICAgKVxuICB9O1xufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHsgU2ltcGxlUXVldWUgfSBmcm9tICcuLi9zaW1wbGUtcXVldWUnO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljQ2FuY2VsLFxuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNJbml0aWFsaXplLFxuICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlLFxuICByZWFkZXJMb2NrRXhjZXB0aW9uXG59IGZyb20gJy4vZ2VuZXJpYy1yZWFkZXInO1xuaW1wb3J0IHsgSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCwgdHlwZSBSZWFkYWJsZUJ5dGVTdHJlYW0sIHR5cGUgUmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHtcbiAgSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUHVsbEludG9cbn0gZnJvbSAnLi9ieXRlLXN0cmVhbS1jb250cm9sbGVyJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IG5ld1Byb21pc2UsIHByb21pc2VSZWplY3RlZFdpdGggfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgeyBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50IH0gZnJvbSAnLi4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBhc3NlcnRSZWFkYWJsZVN0cmVhbSB9IGZyb20gJy4uL3ZhbGlkYXRvcnMvcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7IElzRGV0YWNoZWRCdWZmZXIgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvZWNtYXNjcmlwdCc7XG5pbXBvcnQgdHlwZSB7XG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zLFxuICBWYWxpZGF0ZWRSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9uc1xufSBmcm9tICcuL3JlYWRlci1vcHRpb25zJztcbmltcG9ydCB7IGNvbnZlcnRCeW9iUmVhZE9wdGlvbnMgfSBmcm9tICcuLi92YWxpZGF0b3JzL3JlYWRlci1vcHRpb25zJztcbmltcG9ydCB7IGlzRGF0YVZpZXcsIHR5cGUgTm9uU2hhcmVkLCB0eXBlIFR5cGVkQXJyYXkgfSBmcm9tICcuLi9oZWxwZXJzL2FycmF5LWJ1ZmZlci12aWV3JztcblxuLyoqXG4gKiBBIHJlc3VsdCByZXR1cm5lZCBieSB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnJlYWR9LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IHR5cGUgUmVhZGFibGVTdHJlYW1CWU9CUmVhZFJlc3VsdDxUIGV4dGVuZHMgQXJyYXlCdWZmZXJWaWV3PiA9IHtcbiAgZG9uZTogZmFsc2U7XG4gIHZhbHVlOiBUO1xufSB8IHtcbiAgZG9uZTogdHJ1ZTtcbiAgdmFsdWU6IFQgfCB1bmRlZmluZWQ7XG59O1xuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW0uXG5cbmV4cG9ydCBmdW5jdGlvbiBBY3F1aXJlUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtKTogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyIHtcbiAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIoc3RyZWFtIGFzIFJlYWRhYmxlU3RyZWFtPFVpbnQ4QXJyYXk+KTtcbn1cblxuLy8gUmVhZGFibGVTdHJlYW0gQVBJIGV4cG9zZWQgZm9yIGNvbnRyb2xsZXJzLlxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1BZGRSZWFkSW50b1JlcXVlc3Q8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gIHJlYWRJbnRvUmVxdWVzdDogUmVhZEludG9SZXF1ZXN0PFQ+XG4pOiB2b2lkIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHN0cmVhbS5fcmVhZGVyKSk7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnIHx8IHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnKTtcblxuICAoc3RyZWFtLl9yZWFkZXIhIGFzIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcikuX3JlYWRJbnRvUmVxdWVzdHMucHVzaChyZWFkSW50b1JlcXVlc3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZEludG9SZXF1ZXN0KHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVuazogQXJyYXlCdWZmZXJWaWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lOiBib29sZWFuKSB7XG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyIGFzIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcjtcblxuICBhc3NlcnQocmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzLmxlbmd0aCA+IDApO1xuXG4gIGNvbnN0IHJlYWRJbnRvUmVxdWVzdCA9IHJlYWRlci5fcmVhZEludG9SZXF1ZXN0cy5zaGlmdCgpITtcbiAgaWYgKGRvbmUpIHtcbiAgICByZWFkSW50b1JlcXVlc3QuX2Nsb3NlU3RlcHMoY2h1bmspO1xuICB9IGVsc2Uge1xuICAgIHJlYWRJbnRvUmVxdWVzdC5fY2h1bmtTdGVwcyhjaHVuayk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZEludG9SZXF1ZXN0cyhzdHJlYW06IFJlYWRhYmxlQnl0ZVN0cmVhbSk6IG51bWJlciB7XG4gIHJldHVybiAoc3RyZWFtLl9yZWFkZXIgYXMgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKS5fcmVhZEludG9SZXF1ZXN0cy5sZW5ndGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUhhc0JZT0JSZWFkZXIoc3RyZWFtOiBSZWFkYWJsZUJ5dGVTdHJlYW0pOiBib29sZWFuIHtcbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLl9yZWFkZXI7XG5cbiAgaWYgKHJlYWRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihyZWFkZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFJlYWRlcnNcblxuZXhwb3J0IGludGVyZmFjZSBSZWFkSW50b1JlcXVlc3Q8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PiB7XG4gIF9jaHVua1N0ZXBzKGNodW5rOiBUKTogdm9pZDtcblxuICBfY2xvc2VTdGVwcyhjaHVuazogVCB8IHVuZGVmaW5lZCk6IHZvaWQ7XG5cbiAgX2Vycm9yU3RlcHMoZTogYW55KTogdm9pZDtcbn1cblxuLyoqXG4gKiBBIEJZT0IgcmVhZGVyIHZlbmRlZCBieSBhIHtAbGluayBSZWFkYWJsZVN0cmVhbX0uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb3duZXJSZWFkYWJsZVN0cmVhbSE6IFJlYWRhYmxlQnl0ZVN0cmVhbTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZSE6IFByb21pc2U8dW5kZWZpbmVkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZV9yZXNvbHZlPzogKHZhbHVlPzogdW5kZWZpbmVkKSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZWRQcm9taXNlX3JlamVjdD86IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVhZEludG9SZXF1ZXN0czogU2ltcGxlUXVldWU8UmVhZEludG9SZXF1ZXN0PGFueT4+O1xuXG4gIGNvbnN0cnVjdG9yKHN0cmVhbTogUmVhZGFibGVTdHJlYW08VWludDhBcnJheT4pIHtcbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KHN0cmVhbSwgMSwgJ1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcicpO1xuICAgIGFzc2VydFJlYWRhYmxlU3RyZWFtKHN0cmVhbSwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuXG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhpcyBzdHJlYW0gaGFzIGFscmVhZHkgYmVlbiBsb2NrZWQgZm9yIGV4Y2x1c2l2ZSByZWFkaW5nIGJ5IGFub3RoZXIgcmVhZGVyJyk7XG4gICAgfVxuXG4gICAgaWYgKCFJc1JlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXIoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29uc3RydWN0IGEgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyIGZvciBhIHN0cmVhbSBub3QgY29uc3RydWN0ZWQgd2l0aCBhIGJ5dGUgJyArXG4gICAgICAgICdzb3VyY2UnKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNJbml0aWFsaXplKHRoaXMsIHN0cmVhbSk7XG5cbiAgICB0aGlzLl9yZWFkSW50b1JlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIGZ1bGZpbGxlZCB3aGVuIHRoZSBzdHJlYW0gYmVjb21lcyBjbG9zZWQsIG9yIHJlamVjdGVkIGlmIHRoZSBzdHJlYW0gZXZlciBlcnJvcnMgb3JcbiAgICogdGhlIHJlYWRlcidzIGxvY2sgaXMgcmVsZWFzZWQgYmVmb3JlIHRoZSBzdHJlYW0gZmluaXNoZXMgY2xvc2luZy5cbiAgICovXG4gIGdldCBjbG9zZWQoKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChieW9iUmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2VkJykpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jbG9zZWRQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSByZWFkZXIgaXMgYWN0aXZlLCBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBSZWFkYWJsZVN0cmVhbS5jYW5jZWwgfCBzdHJlYW0uY2FuY2VsKHJlYXNvbil9LlxuICAgKi9cbiAgY2FuY2VsKHJlYXNvbjogYW55ID0gdW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoYnlvYlJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2NhbmNlbCcpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJSZWFkYWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChyZWFkZXJMb2NrRXhjZXB0aW9uKCdjYW5jZWwnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY0NhbmNlbCh0aGlzLCByZWFzb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHJlYWRzIGJ5dGVzIGludG8gdmlldywgYW5kIHJldHVybnMgYSBwcm9taXNlIHJlc29sdmVkIHdpdGggdGhlIHJlc3VsdC5cbiAgICpcbiAgICogSWYgcmVhZGluZyBhIGNodW5rIGNhdXNlcyB0aGUgcXVldWUgdG8gYmVjb21lIGVtcHR5LCBtb3JlIGRhdGEgd2lsbCBiZSBwdWxsZWQgZnJvbSB0aGUgdW5kZXJseWluZyBzb3VyY2UuXG4gICAqL1xuICByZWFkPFQgZXh0ZW5kcyBBcnJheUJ1ZmZlclZpZXc+KFxuICAgIHZpZXc6IFQsXG4gICAgb3B0aW9ucz86IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zXG4gICk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1CWU9CUmVhZFJlc3VsdDxUPj47XG4gIHJlYWQ8VCBleHRlbmRzIE5vblNoYXJlZDxBcnJheUJ1ZmZlclZpZXc+PihcbiAgICB2aWV3OiBULFxuICAgIHJhd09wdGlvbnM6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9XG4gICk6IFByb21pc2U8UmVhZGFibGVTdHJlYW1CWU9CUmVhZFJlc3VsdDxUPj4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGJ5b2JSZWFkZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdyZWFkJykpO1xuICAgIH1cblxuICAgIGlmICghQXJyYXlCdWZmZXIuaXNWaWV3KHZpZXcpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCd2aWV3IG11c3QgYmUgYW4gYXJyYXkgYnVmZmVyIHZpZXcnKSk7XG4gICAgfVxuICAgIGlmICh2aWV3LmJ5dGVMZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ3ZpZXcgbXVzdCBoYXZlIG5vbi16ZXJvIGJ5dGVMZW5ndGgnKSk7XG4gICAgfVxuICAgIGlmICh2aWV3LmJ1ZmZlci5ieXRlTGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKGB2aWV3J3MgYnVmZmVyIG11c3QgaGF2ZSBub24temVybyBieXRlTGVuZ3RoYCkpO1xuICAgIH1cbiAgICBpZiAoSXNEZXRhY2hlZEJ1ZmZlcih2aWV3LmJ1ZmZlcikpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ3ZpZXdcXCdzIGJ1ZmZlciBoYXMgYmVlbiBkZXRhY2hlZCcpKTtcbiAgICB9XG5cbiAgICBsZXQgb3B0aW9uczogVmFsaWRhdGVkUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZE9wdGlvbnM7XG4gICAgdHJ5IHtcbiAgICAgIG9wdGlvbnMgPSBjb252ZXJ0QnlvYlJlYWRPcHRpb25zKHJhd09wdGlvbnMsICdvcHRpb25zJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuICAgIGNvbnN0IG1pbiA9IG9wdGlvbnMubWluO1xuICAgIGlmIChtaW4gPT09IDApIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMubWluIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAnKSk7XG4gICAgfVxuICAgIGlmICghaXNEYXRhVmlldyh2aWV3KSkge1xuICAgICAgaWYgKG1pbiA+ICh2aWV3IGFzIHVua25vd24gYXMgVHlwZWRBcnJheSkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBSYW5nZUVycm9yKCdvcHRpb25zLm1pbiBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB2aWV3XFwncyBsZW5ndGgnKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtaW4gPiB2aWV3LmJ5dGVMZW5ndGgpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBSYW5nZUVycm9yKCdvcHRpb25zLm1pbiBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB2aWV3XFwncyBieXRlTGVuZ3RoJykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lclJlYWRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHJlYWRlckxvY2tFeGNlcHRpb24oJ3JlYWQgZnJvbScpKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb2x2ZVByb21pc2UhOiAocmVzdWx0OiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkUmVzdWx0PFQ+KSA9PiB2b2lkO1xuICAgIGxldCByZWplY3RQcm9taXNlITogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXdQcm9taXNlPFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQ8VD4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgICAgIHJlamVjdFByb21pc2UgPSByZWplY3Q7XG4gICAgfSk7XG4gICAgY29uc3QgcmVhZEludG9SZXF1ZXN0OiBSZWFkSW50b1JlcXVlc3Q8VD4gPSB7XG4gICAgICBfY2h1bmtTdGVwczogY2h1bmsgPT4gcmVzb2x2ZVByb21pc2UoeyB2YWx1ZTogY2h1bmssIGRvbmU6IGZhbHNlIH0pLFxuICAgICAgX2Nsb3NlU3RlcHM6IGNodW5rID0+IHJlc29sdmVQcm9taXNlKHsgdmFsdWU6IGNodW5rLCBkb25lOiB0cnVlIH0pLFxuICAgICAgX2Vycm9yU3RlcHM6IGUgPT4gcmVqZWN0UHJvbWlzZShlKVxuICAgIH07XG4gICAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZCh0aGlzLCB2aWV3LCBtaW4sIHJlYWRJbnRvUmVxdWVzdCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZXMgdGhlIHJlYWRlcidzIGxvY2sgb24gdGhlIGNvcnJlc3BvbmRpbmcgc3RyZWFtLiBBZnRlciB0aGUgbG9jayBpcyByZWxlYXNlZCwgdGhlIHJlYWRlciBpcyBubyBsb25nZXIgYWN0aXZlLlxuICAgKiBJZiB0aGUgYXNzb2NpYXRlZCBzdHJlYW0gaXMgZXJyb3JlZCB3aGVuIHRoZSBsb2NrIGlzIHJlbGVhc2VkLCB0aGUgcmVhZGVyIHdpbGwgYXBwZWFyIGVycm9yZWQgaW4gdGhlIHNhbWUgd2F5XG4gICAqIGZyb20gbm93IG9uOyBvdGhlcndpc2UsIHRoZSByZWFkZXIgd2lsbCBhcHBlYXIgY2xvc2VkLlxuICAgKlxuICAgKiBBIHJlYWRlcidzIGxvY2sgY2Fubm90IGJlIHJlbGVhc2VkIHdoaWxlIGl0IHN0aWxsIGhhcyBhIHBlbmRpbmcgcmVhZCByZXF1ZXN0LCBpLmUuLCBpZiBhIHByb21pc2UgcmV0dXJuZWQgYnlcbiAgICogdGhlIHJlYWRlcidzIHtAbGluayBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucmVhZCB8IHJlYWQoKX0gbWV0aG9kIGhhcyBub3QgeWV0IGJlZW4gc2V0dGxlZC4gQXR0ZW1wdGluZyB0b1xuICAgKiBkbyBzbyB3aWxsIHRocm93IGEgYFR5cGVFcnJvcmAgYW5kIGxlYXZlIHRoZSByZWFkZXIgbG9ja2VkIHRvIHRoZSBzdHJlYW0uXG4gICAqL1xuICByZWxlYXNlTG9jaygpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBieW9iUmVhZGVyQnJhbmRDaGVja0V4Y2VwdGlvbigncmVsZWFzZUxvY2snKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3duZXJSZWFkYWJsZVN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVsZWFzZSh0aGlzKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLCB7XG4gIGNhbmNlbDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHJlYWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICByZWxlYXNlTG9jazogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGNsb3NlZDogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5wcm90b3R5cGUuY2FuY2VsLCAnY2FuY2VsJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnByb3RvdHlwZS5yZWFkLCAncmVhZCcpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5wcm90b3R5cGUucmVsZWFzZUxvY2ssICdyZWxlYXNlTG9jaycpO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcicsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgcmVhZGVycy5cblxuZXhwb3J0IGZ1bmN0aW9uIElzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHg6IGFueSk6IHggaXMgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyIHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX3JlYWRJbnRvUmVxdWVzdHMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZDxUIGV4dGVuZHMgTm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+KFxuICByZWFkZXI6IFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgdmlldzogVCxcbiAgbWluOiBudW1iZXIsXG4gIHJlYWRJbnRvUmVxdWVzdDogUmVhZEludG9SZXF1ZXN0PFQ+XG4pOiB2b2lkIHtcbiAgY29uc3Qgc3RyZWFtID0gcmVhZGVyLl9vd25lclJlYWRhYmxlU3RyZWFtO1xuXG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG5cbiAgc3RyZWFtLl9kaXN0dXJiZWQgPSB0cnVlO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZWFkSW50b1JlcXVlc3QuX2Vycm9yU3RlcHMoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH0gZWxzZSB7XG4gICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclB1bGxJbnRvKFxuICAgICAgc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIgYXMgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgICAgIHZpZXcsXG4gICAgICBtaW4sXG4gICAgICByZWFkSW50b1JlcXVlc3RcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWxlYXNlKHJlYWRlcjogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKSB7XG4gIFJlYWRhYmxlU3RyZWFtUmVhZGVyR2VuZXJpY1JlbGVhc2UocmVhZGVyKTtcbiAgY29uc3QgZSA9IG5ldyBUeXBlRXJyb3IoJ1JlYWRlciB3YXMgcmVsZWFzZWQnKTtcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyRXJyb3JSZWFkSW50b1JlcXVlc3RzKHJlYWRlciwgZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJFcnJvclJlYWRJbnRvUmVxdWVzdHMocmVhZGVyOiBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIsIGU6IGFueSkge1xuICBjb25zdCByZWFkSW50b1JlcXVlc3RzID0gcmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzO1xuICByZWFkZXIuX3JlYWRJbnRvUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcbiAgcmVhZEludG9SZXF1ZXN0cy5mb3JFYWNoKHJlYWRJbnRvUmVxdWVzdCA9PiB7XG4gICAgcmVhZEludG9SZXF1ZXN0Ll9lcnJvclN0ZXBzKGUpO1xuICB9KTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5cblxuZnVuY3Rpb24gYnlvYlJlYWRlckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlci5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyYCk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjayB9IGZyb20gJy4uL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IE51bWJlcklzTmFOIGZyb20gJy4uLy4uL3N0dWIvbnVtYmVyLWlzbmFuJztcblxuZXhwb3J0IGZ1bmN0aW9uIEV4dHJhY3RIaWdoV2F0ZXJNYXJrKHN0cmF0ZWd5OiBRdWV1aW5nU3RyYXRlZ3ksIGRlZmF1bHRIV006IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IHsgaGlnaFdhdGVyTWFyayB9ID0gc3RyYXRlZ3k7XG5cbiAgaWYgKGhpZ2hXYXRlck1hcmsgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBkZWZhdWx0SFdNO1xuICB9XG5cbiAgaWYgKE51bWJlcklzTmFOKGhpZ2hXYXRlck1hcmspIHx8IGhpZ2hXYXRlck1hcmsgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgaGlnaFdhdGVyTWFyaycpO1xuICB9XG5cbiAgcmV0dXJuIGhpZ2hXYXRlck1hcms7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFeHRyYWN0U2l6ZUFsZ29yaXRobTxUPihzdHJhdGVneTogUXVldWluZ1N0cmF0ZWd5PFQ+KTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFQ+IHtcbiAgY29uc3QgeyBzaXplIH0gPSBzdHJhdGVneTtcblxuICBpZiAoIXNpemUpIHtcbiAgICByZXR1cm4gKCkgPT4gMTtcbiAgfVxuXG4gIHJldHVybiBzaXplO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2sgfSBmcm9tICcuLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydEZ1bmN0aW9uLCBjb252ZXJ0VW5yZXN0cmljdGVkRG91YmxlIH0gZnJvbSAnLi9iYXNpYyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5PFQ+KGluaXQ6IFF1ZXVpbmdTdHJhdGVneTxUPiB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBRdWV1aW5nU3RyYXRlZ3k8VD4ge1xuICBhc3NlcnREaWN0aW9uYXJ5KGluaXQsIGNvbnRleHQpO1xuICBjb25zdCBoaWdoV2F0ZXJNYXJrID0gaW5pdD8uaGlnaFdhdGVyTWFyaztcbiAgY29uc3Qgc2l6ZSA9IGluaXQ/LnNpemU7XG4gIHJldHVybiB7XG4gICAgaGlnaFdhdGVyTWFyazogaGlnaFdhdGVyTWFyayA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogY29udmVydFVucmVzdHJpY3RlZERvdWJsZShoaWdoV2F0ZXJNYXJrKSxcbiAgICBzaXplOiBzaXplID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5U2l6ZShzaXplLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdzaXplJyB0aGF0YClcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydFF1ZXVpbmdTdHJhdGVneVNpemU8VD4oZm46IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxUPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxUPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIGNodW5rID0+IGNvbnZlcnRVbnJlc3RyaWN0ZWREb3VibGUoZm4oY2h1bmspKTtcbn1cbiIsICJpbXBvcnQgeyBhc3NlcnREaWN0aW9uYXJ5LCBhc3NlcnRGdW5jdGlvbiB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHsgcHJvbWlzZUNhbGwsIHJlZmxlY3RDYWxsIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHR5cGUge1xuICBVbmRlcmx5aW5nU2luayxcbiAgVW5kZXJseWluZ1NpbmtBYm9ydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua0Nsb3NlQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtXcml0ZUNhbGxiYWNrLFxuICBWYWxpZGF0ZWRVbmRlcmx5aW5nU2lua1xufSBmcm9tICcuLi93cml0YWJsZS1zdHJlYW0vdW5kZXJseWluZy1zaW5rJztcbmltcG9ydCB7IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIgfSBmcm9tICcuLi93cml0YWJsZS1zdHJlYW0nO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTaW5rPFc+KG9yaWdpbmFsOiBVbmRlcmx5aW5nU2luazxXPiB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFZhbGlkYXRlZFVuZGVybHlpbmdTaW5rPFc+IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShvcmlnaW5hbCwgY29udGV4dCk7XG4gIGNvbnN0IGFib3J0ID0gb3JpZ2luYWw/LmFib3J0O1xuICBjb25zdCBjbG9zZSA9IG9yaWdpbmFsPy5jbG9zZTtcbiAgY29uc3Qgc3RhcnQgPSBvcmlnaW5hbD8uc3RhcnQ7XG4gIGNvbnN0IHR5cGUgPSBvcmlnaW5hbD8udHlwZTtcbiAgY29uc3Qgd3JpdGUgPSBvcmlnaW5hbD8ud3JpdGU7XG4gIHJldHVybiB7XG4gICAgYWJvcnQ6IGFib3J0ID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU2lua0Fib3J0Q2FsbGJhY2soYWJvcnQsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnYWJvcnQnIHRoYXRgKSxcbiAgICBjbG9zZTogY2xvc2UgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTaW5rQ2xvc2VDYWxsYmFjayhjbG9zZSwgb3JpZ2luYWwhLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdjbG9zZScgdGhhdGApLFxuICAgIHN0YXJ0OiBzdGFydCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NpbmtTdGFydENhbGxiYWNrKHN0YXJ0LCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3N0YXJ0JyB0aGF0YCksXG4gICAgd3JpdGU6IHdyaXRlID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRVbmRlcmx5aW5nU2lua1dyaXRlQ2FsbGJhY2sod3JpdGUsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnd3JpdGUnIHRoYXRgKSxcbiAgICB0eXBlXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU2lua0Fib3J0Q2FsbGJhY2soXG4gIGZuOiBVbmRlcmx5aW5nU2lua0Fib3J0Q2FsbGJhY2ssXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nU2luayxcbiAgY29udGV4dDogc3RyaW5nXG4pOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAocmVhc29uOiBhbnkpID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW3JlYXNvbl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NpbmtDbG9zZUNhbGxiYWNrKFxuICBmbjogVW5kZXJseWluZ1NpbmtDbG9zZUNhbGxiYWNrLFxuICBvcmlnaW5hbDogVW5kZXJseWluZ1NpbmssXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKCkgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuICgpID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW10pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NpbmtTdGFydENhbGxiYWNrKFxuICBmbjogVW5kZXJseWluZ1NpbmtTdGFydENhbGxiYWNrLFxuICBvcmlnaW5hbDogVW5kZXJseWluZ1NpbmssXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogVW5kZXJseWluZ1NpbmtTdGFydENhbGxiYWNrIHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIpID0+IHJlZmxlY3RDYWxsKGZuLCBvcmlnaW5hbCwgW2NvbnRyb2xsZXJdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTaW5rV3JpdGVDYWxsYmFjazxXPihcbiAgZm46IFVuZGVybHlpbmdTaW5rV3JpdGVDYWxsYmFjazxXPixcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdTaW5rPFc+LFxuICBjb250ZXh0OiBzdHJpbmdcbik6IChjaHVuazogVywgY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcikgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjaHVuazogVywgY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcikgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbY2h1bmssIGNvbnRyb2xsZXJdKTtcbn1cbiIsICJpbXBvcnQgeyBJc1dyaXRhYmxlU3RyZWFtLCBXcml0YWJsZVN0cmVhbSB9IGZyb20gJy4uL3dyaXRhYmxlLXN0cmVhbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRXcml0YWJsZVN0cmVhbSh4OiB1bmtub3duLCBjb250ZXh0OiBzdHJpbmcpOiBhc3NlcnRzIHggaXMgV3JpdGFibGVTdHJlYW0ge1xuICBpZiAoIUlzV3JpdGFibGVTdHJlYW0oeCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9IGlzIG5vdCBhIFdyaXRhYmxlU3RyZWFtLmApO1xuICB9XG59XG4iLCAiLyoqXG4gKiBBIHNpZ25hbCBvYmplY3QgdGhhdCBhbGxvd3MgeW91IHRvIGNvbW11bmljYXRlIHdpdGggYSByZXF1ZXN0IGFuZCBhYm9ydCBpdCBpZiByZXF1aXJlZFxuICogdmlhIGl0cyBhc3NvY2lhdGVkIGBBYm9ydENvbnRyb2xsZXJgIG9iamVjdC5cbiAqXG4gKiBAcmVtYXJrc1xuICogICBUaGlzIGludGVyZmFjZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIGBBYm9ydFNpZ25hbGAgaW50ZXJmYWNlIGRlZmluZWQgaW4gVHlwZVNjcmlwdCdzIERPTSB0eXBlcy5cbiAqICAgSXQgaXMgcmVkZWZpbmVkIGhlcmUsIHNvIGl0IGNhbiBiZSBwb2x5ZmlsbGVkIHdpdGhvdXQgYSBET00sIGZvciBleGFtcGxlIHdpdGhcbiAqICAge0BsaW5rIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Fib3J0Y29udHJvbGxlci1wb2x5ZmlsbCB8IGFib3J0Y29udHJvbGxlci1wb2x5ZmlsbH0gaW4gYSBOb2RlIGVudmlyb25tZW50LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBYm9ydFNpZ25hbCB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSByZXF1ZXN0IGlzIGFib3J0ZWQuXG4gICAqL1xuICByZWFkb25seSBhYm9ydGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBhYm9ydGVkLCByZXR1cm5zIHRoZSByZWFzb24gZm9yIGFib3J0aW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVhc29uPzogYW55O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhpcyBzaWduYWwgYmVjb21lcyBhYm9ydGVkLlxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlOiAnYWJvcnQnLCBsaXN0ZW5lcjogKCkgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBldmVudCBsaXN0ZW5lciB0aGF0IHdhcyBwcmV2aW91c2x5IGFkZGVkIHdpdGgge0BsaW5rIEFib3J0U2lnbmFsLmFkZEV2ZW50TGlzdGVuZXJ9LlxuICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiAnYWJvcnQnLCBsaXN0ZW5lcjogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Fib3J0U2lnbmFsKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgQWJvcnRTaWduYWwge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB0cnkge1xuICAgIHJldHVybiB0eXBlb2YgKHZhbHVlIGFzIEFib3J0U2lnbmFsKS5hYm9ydGVkID09PSAnYm9vbGVhbic7XG4gIH0gY2F0Y2gge1xuICAgIC8vIEFib3J0U2lnbmFsLnByb3RvdHlwZS5hYm9ydGVkIHRocm93cyBpZiBpdHMgYnJhbmQgY2hlY2sgZmFpbHNcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNvbnRyb2xsZXIgb2JqZWN0IHRoYXQgYWxsb3dzIHlvdSB0byBhYm9ydCBhbiBgQWJvcnRTaWduYWxgIHdoZW4gZGVzaXJlZC5cbiAqXG4gKiBAcmVtYXJrc1xuICogICBUaGlzIGludGVyZmFjZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIGBBYm9ydENvbnRyb2xsZXJgIGludGVyZmFjZSBkZWZpbmVkIGluIFR5cGVTY3JpcHQncyBET00gdHlwZXMuXG4gKiAgIEl0IGlzIHJlZGVmaW5lZCBoZXJlLCBzbyBpdCBjYW4gYmUgcG9seWZpbGxlZCB3aXRob3V0IGEgRE9NLCBmb3IgZXhhbXBsZSB3aXRoXG4gKiAgIHtAbGluayBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9hYm9ydGNvbnRyb2xsZXItcG9seWZpbGwgfCBhYm9ydGNvbnRyb2xsZXItcG9seWZpbGx9IGluIGEgTm9kZSBlbnZpcm9ubWVudC5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBYm9ydENvbnRyb2xsZXIge1xuICByZWFkb25seSBzaWduYWw6IEFib3J0U2lnbmFsO1xuXG4gIGFib3J0KHJlYXNvbj86IGFueSk6IHZvaWQ7XG59XG5cbmludGVyZmFjZSBBYm9ydENvbnRyb2xsZXJDb25zdHJ1Y3RvciB7XG4gIG5ldygpOiBBYm9ydENvbnRyb2xsZXI7XG59XG5cbmNvbnN0IHN1cHBvcnRzQWJvcnRDb250cm9sbGVyID0gdHlwZW9mIChBYm9ydENvbnRyb2xsZXIgYXMgYW55KSA9PT0gJ2Z1bmN0aW9uJztcblxuLyoqXG4gKiBDb25zdHJ1Y3QgYSBuZXcgQWJvcnRDb250cm9sbGVyLCBpZiBzdXBwb3J0ZWQgYnkgdGhlIHBsYXRmb3JtLlxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWJvcnRDb250cm9sbGVyKCk6IEFib3J0Q29udHJvbGxlciB8IHVuZGVmaW5lZCB7XG4gIGlmIChzdXBwb3J0c0Fib3J0Q29udHJvbGxlcikge1xuICAgIHJldHVybiBuZXcgKEFib3J0Q29udHJvbGxlciBhcyBBYm9ydENvbnRyb2xsZXJDb25zdHJ1Y3RvcikoKTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwgImltcG9ydCBhc3NlcnQgZnJvbSAnLi4vc3R1Yi9hc3NlcnQnO1xuaW1wb3J0IHtcbiAgbmV3UHJvbWlzZSxcbiAgcHJvbWlzZVJlamVjdGVkV2l0aCxcbiAgcHJvbWlzZVJlc29sdmVkV2l0aCxcbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZSxcbiAgdXBvblByb21pc2Vcbn0gZnJvbSAnLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQge1xuICBEZXF1ZXVlVmFsdWUsXG4gIEVucXVldWVWYWx1ZVdpdGhTaXplLFxuICBQZWVrUXVldWVWYWx1ZSxcbiAgdHlwZSBRdWV1ZVBhaXIsXG4gIFJlc2V0UXVldWVcbn0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvcXVldWUtd2l0aC1zaXplcyc7XG5pbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrIH0gZnJvbSAnLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi9zaW1wbGUtcXVldWUnO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBBYm9ydFN0ZXBzLCBFcnJvclN0ZXBzIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcyc7XG5pbXBvcnQgeyBJc05vbk5lZ2F0aXZlTnVtYmVyIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBFeHRyYWN0SGlnaFdhdGVyTWFyaywgRXh0cmFjdFNpemVBbGdvcml0aG0gfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgdHlwZSB7XG4gIFVuZGVybHlpbmdTaW5rLFxuICBVbmRlcmx5aW5nU2lua0Fib3J0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rQ2xvc2VDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua1dyaXRlQ2FsbGJhY2ssXG4gIFZhbGlkYXRlZFVuZGVybHlpbmdTaW5rXG59IGZyb20gJy4vd3JpdGFibGUtc3RyZWFtL3VuZGVybHlpbmctc2luayc7XG5pbXBvcnQgeyBhc3NlcnRPYmplY3QsIGFzc2VydFJlcXVpcmVkQXJndW1lbnQgfSBmcm9tICcuL3ZhbGlkYXRvcnMvYmFzaWMnO1xuaW1wb3J0IHsgY29udmVydFVuZGVybHlpbmdTaW5rIH0gZnJvbSAnLi92YWxpZGF0b3JzL3VuZGVybHlpbmctc2luayc7XG5pbXBvcnQgeyBhc3NlcnRXcml0YWJsZVN0cmVhbSB9IGZyb20gJy4vdmFsaWRhdG9ycy93cml0YWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgdHlwZSBBYm9ydENvbnRyb2xsZXIsIHR5cGUgQWJvcnRTaWduYWwsIGNyZWF0ZUFib3J0Q29udHJvbGxlciB9IGZyb20gJy4vYWJvcnQtc2lnbmFsJztcblxudHlwZSBXcml0YWJsZVN0cmVhbVN0YXRlID0gJ3dyaXRhYmxlJyB8ICdjbG9zZWQnIHwgJ2Vycm9yaW5nJyB8ICdlcnJvcmVkJztcblxuaW50ZXJmYWNlIFdyaXRlT3JDbG9zZVJlcXVlc3Qge1xuICBfcmVzb2x2ZTogKHZhbHVlPzogdW5kZWZpbmVkKSA9PiB2b2lkO1xuICBfcmVqZWN0OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG59XG5cbnR5cGUgV3JpdGVSZXF1ZXN0ID0gV3JpdGVPckNsb3NlUmVxdWVzdDtcbnR5cGUgQ2xvc2VSZXF1ZXN0ID0gV3JpdGVPckNsb3NlUmVxdWVzdDtcblxuaW50ZXJmYWNlIFBlbmRpbmdBYm9ydFJlcXVlc3Qge1xuICBfcHJvbWlzZTogUHJvbWlzZTx1bmRlZmluZWQ+O1xuICBfcmVzb2x2ZTogKHZhbHVlPzogdW5kZWZpbmVkKSA9PiB2b2lkO1xuICBfcmVqZWN0OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIF9yZWFzb246IGFueTtcbiAgX3dhc0FscmVhZHlFcnJvcmluZzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIHdyaXRhYmxlIHN0cmVhbSByZXByZXNlbnRzIGEgZGVzdGluYXRpb24gZm9yIGRhdGEsIGludG8gd2hpY2ggeW91IGNhbiB3cml0ZS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFdyaXRhYmxlU3RyZWFtPFcgPSBhbnk+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RhdGUhOiBXcml0YWJsZVN0cmVhbVN0YXRlO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdG9yZWRFcnJvcjogYW55O1xuICAvKiogQGludGVybmFsICovXG4gIF93cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXPiB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfd3JpdGFibGVTdHJlYW1Db250cm9sbGVyITogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfd3JpdGVSZXF1ZXN0cyE6IFNpbXBsZVF1ZXVlPFdyaXRlUmVxdWVzdD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2luRmxpZ2h0V3JpdGVSZXF1ZXN0OiBXcml0ZVJlcXVlc3QgfCB1bmRlZmluZWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlUmVxdWVzdDogQ2xvc2VSZXF1ZXN0IHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9pbkZsaWdodENsb3NlUmVxdWVzdDogQ2xvc2VSZXF1ZXN0IHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nQWJvcnRSZXF1ZXN0OiBQZW5kaW5nQWJvcnRSZXF1ZXN0IHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9iYWNrcHJlc3N1cmUhOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHVuZGVybHlpbmdTaW5rPzogVW5kZXJseWluZ1Npbms8Vz4sIHN0cmF0ZWd5PzogUXVldWluZ1N0cmF0ZWd5PFc+KTtcbiAgY29uc3RydWN0b3IocmF3VW5kZXJseWluZ1Npbms6IFVuZGVybHlpbmdTaW5rPFc+IHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9LFxuICAgICAgICAgICAgICByYXdTdHJhdGVneTogUXVldWluZ1N0cmF0ZWd5PFc+IHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9KSB7XG4gICAgaWYgKHJhd1VuZGVybHlpbmdTaW5rID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJhd1VuZGVybHlpbmdTaW5rID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0T2JqZWN0KHJhd1VuZGVybHlpbmdTaW5rLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyYXRlZ3kgPSBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5KHJhd1N0cmF0ZWd5LCAnU2Vjb25kIHBhcmFtZXRlcicpO1xuICAgIGNvbnN0IHVuZGVybHlpbmdTaW5rID0gY29udmVydFVuZGVybHlpbmdTaW5rKHJhd1VuZGVybHlpbmdTaW5rLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG5cbiAgICBJbml0aWFsaXplV3JpdGFibGVTdHJlYW0odGhpcyk7XG5cbiAgICBjb25zdCB0eXBlID0gdW5kZXJseWluZ1NpbmsudHlwZTtcbiAgICBpZiAodHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlIGlzIHNwZWNpZmllZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHNpemVBbGdvcml0aG0gPSBFeHRyYWN0U2l6ZUFsZ29yaXRobShzdHJhdGVneSk7XG4gICAgY29uc3QgaGlnaFdhdGVyTWFyayA9IEV4dHJhY3RIaWdoV2F0ZXJNYXJrKHN0cmF0ZWd5LCAxKTtcblxuICAgIFNldFVwV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21VbmRlcmx5aW5nU2luayh0aGlzLCB1bmRlcmx5aW5nU2luaywgaGlnaFdhdGVyTWFyaywgc2l6ZUFsZ29yaXRobSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgd3JpdGFibGUgc3RyZWFtIGlzIGxvY2tlZCB0byBhIHdyaXRlci5cbiAgICovXG4gIGdldCBsb2NrZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdsb2NrZWQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSXNXcml0YWJsZVN0cmVhbUxvY2tlZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBYm9ydHMgdGhlIHN0cmVhbSwgc2lnbmFsaW5nIHRoYXQgdGhlIHByb2R1Y2VyIGNhbiBubyBsb25nZXIgc3VjY2Vzc2Z1bGx5IHdyaXRlIHRvIHRoZSBzdHJlYW0gYW5kIGl0IGlzIHRvIGJlXG4gICAqIGltbWVkaWF0ZWx5IG1vdmVkIHRvIGFuIGVycm9yZWQgc3RhdGUsIHdpdGggYW55IHF1ZXVlZC11cCB3cml0ZXMgZGlzY2FyZGVkLiBUaGlzIHdpbGwgYWxzbyBleGVjdXRlIGFueSBhYm9ydFxuICAgKiBtZWNoYW5pc20gb2YgdGhlIHVuZGVybHlpbmcgc2luay5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBmdWxmaWxsIGlmIHRoZSBzdHJlYW0gc2h1dHMgZG93biBzdWNjZXNzZnVsbHksIG9yIHJlamVjdCBpZiB0aGUgdW5kZXJseWluZyBzaW5rIHNpZ25hbGVkXG4gICAqIHRoYXQgdGhlcmUgd2FzIGFuIGVycm9yIGRvaW5nIHNvLiBBZGRpdGlvbmFsbHksIGl0IHdpbGwgcmVqZWN0IHdpdGggYSBgVHlwZUVycm9yYCAod2l0aG91dCBhdHRlbXB0aW5nIHRvIGNhbmNlbFxuICAgKiB0aGUgc3RyZWFtKSBpZiB0aGUgc3RyZWFtIGlzIGN1cnJlbnRseSBsb2NrZWQuXG4gICAqL1xuICBhYm9ydChyZWFzb246IGFueSA9IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignYWJvcnQnKSk7XG4gICAgfVxuXG4gICAgaWYgKElzV3JpdGFibGVTdHJlYW1Mb2NrZWQodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBhYm9ydCBhIHN0cmVhbSB0aGF0IGFscmVhZHkgaGFzIGEgd3JpdGVyJykpO1xuICAgIH1cblxuICAgIHJldHVybiBXcml0YWJsZVN0cmVhbUFib3J0KHRoaXMsIHJlYXNvbik7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBzdHJlYW0uIFRoZSB1bmRlcmx5aW5nIHNpbmsgd2lsbCBmaW5pc2ggcHJvY2Vzc2luZyBhbnkgcHJldmlvdXNseS13cml0dGVuIGNodW5rcywgYmVmb3JlIGludm9raW5nIGl0c1xuICAgKiBjbG9zZSBiZWhhdmlvci4gRHVyaW5nIHRoaXMgdGltZSBhbnkgZnVydGhlciBhdHRlbXB0cyB0byB3cml0ZSB3aWxsIGZhaWwgKHdpdGhvdXQgZXJyb3JpbmcgdGhlIHN0cmVhbSkuXG4gICAqXG4gICAqIFRoZSBtZXRob2QgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGZ1bGZpbGwgaWYgYWxsIHJlbWFpbmluZyBjaHVua3MgYXJlIHN1Y2Nlc3NmdWxseSB3cml0dGVuIGFuZCB0aGUgc3RyZWFtXG4gICAqIHN1Y2Nlc3NmdWxseSBjbG9zZXMsIG9yIHJlamVjdHMgaWYgYW4gZXJyb3IgaXMgZW5jb3VudGVyZWQgZHVyaW5nIHRoaXMgcHJvY2Vzcy4gQWRkaXRpb25hbGx5LCBpdCB3aWxsIHJlamVjdCB3aXRoXG4gICAqIGEgYFR5cGVFcnJvcmAgKHdpdGhvdXQgYXR0ZW1wdGluZyB0byBjYW5jZWwgdGhlIHN0cmVhbSkgaWYgdGhlIHN0cmVhbSBpcyBjdXJyZW50bHkgbG9ja2VkLlxuICAgKi9cbiAgY2xvc2UoKSB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdjbG9zZScpKTtcbiAgICB9XG5cbiAgICBpZiAoSXNXcml0YWJsZVN0cmVhbUxvY2tlZCh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcignQ2Fubm90IGNsb3NlIGEgc3RyZWFtIHRoYXQgYWxyZWFkeSBoYXMgYSB3cml0ZXInKSk7XG4gICAgfVxuXG4gICAgaWYgKFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2xvc2UgYW4gYWxyZWFkeS1jbG9zaW5nIHN0cmVhbScpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1DbG9zZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEge0BsaW5rIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciB8IHdyaXRlcn0gYW5kIGxvY2tzIHRoZSBzdHJlYW0gdG8gdGhlIG5ldyB3cml0ZXIuIFdoaWxlIHRoZSBzdHJlYW1cbiAgICogaXMgbG9ja2VkLCBubyBvdGhlciB3cml0ZXIgY2FuIGJlIGFjcXVpcmVkIHVudGlsIHRoaXMgb25lIGlzIHJlbGVhc2VkLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uYWxpdHkgaXMgZXNwZWNpYWxseSB1c2VmdWwgZm9yIGNyZWF0aW5nIGFic3RyYWN0aW9ucyB0aGF0IGRlc2lyZSB0aGUgYWJpbGl0eSB0byB3cml0ZSB0byBhIHN0cmVhbVxuICAgKiB3aXRob3V0IGludGVycnVwdGlvbiBvciBpbnRlcmxlYXZpbmcuIEJ5IGdldHRpbmcgYSB3cml0ZXIgZm9yIHRoZSBzdHJlYW0sIHlvdSBjYW4gZW5zdXJlIG5vYm9keSBlbHNlIGNhbiB3cml0ZSBhdFxuICAgKiB0aGUgc2FtZSB0aW1lLCB3aGljaCB3b3VsZCBjYXVzZSB0aGUgcmVzdWx0aW5nIHdyaXR0ZW4gZGF0YSB0byBiZSB1bnByZWRpY3RhYmxlIGFuZCBwcm9iYWJseSB1c2VsZXNzLlxuICAgKi9cbiAgZ2V0V3JpdGVyKCk6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcjxXPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtKHRoaXMpKSB7XG4gICAgICB0aHJvdyBzdHJlYW1CcmFuZENoZWNrRXhjZXB0aW9uKCdnZXRXcml0ZXInKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQWNxdWlyZVdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUsIHtcbiAgYWJvcnQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBjbG9zZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGdldFdyaXRlcjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGxvY2tlZDogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZS5hYm9ydCwgJ2Fib3J0Jyk7XG5zZXRGdW5jdGlvbk5hbWUoV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLmNsb3NlLCAnY2xvc2UnKTtcbnNldEZ1bmN0aW9uTmFtZShXcml0YWJsZVN0cmVhbS5wcm90b3R5cGUuZ2V0V3JpdGVyLCAnZ2V0V3JpdGVyJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdXcml0YWJsZVN0cmVhbScsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5leHBvcnQge1xuICBBY3F1aXJlV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLFxuICBDcmVhdGVXcml0YWJsZVN0cmVhbSxcbiAgSXNXcml0YWJsZVN0cmVhbSxcbiAgSXNXcml0YWJsZVN0cmVhbUxvY2tlZCxcbiAgV3JpdGFibGVTdHJlYW0sXG4gIFdyaXRhYmxlU3RyZWFtQWJvcnQsXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkLFxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJDbG9zZVdpdGhFcnJvclByb3BhZ2F0aW9uLFxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJSZWxlYXNlLFxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJXcml0ZSxcbiAgV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHRcbn07XG5cbmV4cG9ydCB0eXBlIHtcbiAgVW5kZXJseWluZ1NpbmssXG4gIFVuZGVybHlpbmdTaW5rU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NpbmtXcml0ZUNhbGxiYWNrLFxuICBVbmRlcmx5aW5nU2lua0Nsb3NlQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTaW5rQWJvcnRDYWxsYmFja1xufTtcblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFdyaXRhYmxlU3RyZWFtLlxuXG5mdW5jdGlvbiBBY3F1aXJlV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFc+KHN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz4pOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8Vz4ge1xuICByZXR1cm4gbmV3IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcihzdHJlYW0pO1xufVxuXG4vLyBUaHJvd3MgaWYgYW5kIG9ubHkgaWYgc3RhcnRBbGdvcml0aG0gdGhyb3dzLlxuZnVuY3Rpb24gQ3JlYXRlV3JpdGFibGVTdHJlYW08Vz4oc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlQWxnb3JpdGhtOiAoY2h1bms6IFcpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0QWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoV2F0ZXJNYXJrID0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxXPiA9ICgpID0+IDEpIHtcbiAgYXNzZXJ0KElzTm9uTmVnYXRpdmVOdW1iZXIoaGlnaFdhdGVyTWFyaykpO1xuXG4gIGNvbnN0IHN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz4gPSBPYmplY3QuY3JlYXRlKFdyaXRhYmxlU3RyZWFtLnByb3RvdHlwZSk7XG4gIEluaXRpYWxpemVXcml0YWJsZVN0cmVhbShzdHJlYW0pO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4gPSBPYmplY3QuY3JlYXRlKFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuICBTZXRVcFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoc3RyZWFtLCBjb250cm9sbGVyLCBzdGFydEFsZ29yaXRobSwgd3JpdGVBbGdvcml0aG0sIGNsb3NlQWxnb3JpdGhtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJvcnRBbGdvcml0aG0sIGhpZ2hXYXRlck1hcmssIHNpemVBbGdvcml0aG0pO1xuICByZXR1cm4gc3RyZWFtO1xufVxuXG5mdW5jdGlvbiBJbml0aWFsaXplV3JpdGFibGVTdHJlYW08Vz4oc3RyZWFtOiBXcml0YWJsZVN0cmVhbTxXPikge1xuICBzdHJlYW0uX3N0YXRlID0gJ3dyaXRhYmxlJztcblxuICAvLyBUaGUgZXJyb3IgdGhhdCB3aWxsIGJlIHJlcG9ydGVkIGJ5IG5ldyBtZXRob2QgY2FsbHMgb25jZSB0aGUgc3RhdGUgYmVjb21lcyBlcnJvcmVkLiBPbmx5IHNldCB3aGVuIFtbc3RhdGVdXSBpc1xuICAvLyAnZXJyb3JpbmcnIG9yICdlcnJvcmVkJy4gTWF5IGJlIHNldCB0byBhbiB1bmRlZmluZWQgdmFsdWUuXG4gIHN0cmVhbS5fc3RvcmVkRXJyb3IgPSB1bmRlZmluZWQ7XG5cbiAgc3RyZWFtLl93cml0ZXIgPSB1bmRlZmluZWQ7XG5cbiAgLy8gSW5pdGlhbGl6ZSB0byB1bmRlZmluZWQgZmlyc3QgYmVjYXVzZSB0aGUgY29uc3RydWN0b3Igb2YgdGhlIGNvbnRyb2xsZXIgY2hlY2tzIHRoaXNcbiAgLy8gdmFyaWFibGUgdG8gdmFsaWRhdGUgdGhlIGNhbGxlci5cbiAgc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIgPSB1bmRlZmluZWQhO1xuXG4gIC8vIFRoaXMgcXVldWUgaXMgcGxhY2VkIGhlcmUgaW5zdGVhZCBvZiB0aGUgd3JpdGVyIGNsYXNzIGluIG9yZGVyIHRvIGFsbG93IGZvciBwYXNzaW5nIGEgd3JpdGVyIHRvIHRoZSBuZXh0IGRhdGFcbiAgLy8gcHJvZHVjZXIgd2l0aG91dCB3YWl0aW5nIGZvciB0aGUgcXVldWVkIHdyaXRlcyB0byBmaW5pc2guXG4gIHN0cmVhbS5fd3JpdGVSZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuXG4gIC8vIFdyaXRlIHJlcXVlc3RzIGFyZSByZW1vdmVkIGZyb20gX3dyaXRlUmVxdWVzdHMgd2hlbiB3cml0ZSgpIGlzIGNhbGxlZCBvbiB0aGUgdW5kZXJseWluZyBzaW5rLiBUaGlzIHByZXZlbnRzXG4gIC8vIHRoZW0gZnJvbSBiZWluZyBlcnJvbmVvdXNseSByZWplY3RlZCBvbiBlcnJvci4gSWYgYSB3cml0ZSgpIGNhbGwgaXMgaW4tZmxpZ2h0LCB0aGUgcmVxdWVzdCBpcyBzdG9yZWQgaGVyZS5cbiAgc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICAvLyBUaGUgcHJvbWlzZSB0aGF0IHdhcyByZXR1cm5lZCBmcm9tIHdyaXRlci5jbG9zZSgpLiBTdG9yZWQgaGVyZSBiZWNhdXNlIGl0IG1heSBiZSBmdWxmaWxsZWQgYWZ0ZXIgdGhlIHdyaXRlclxuICAvLyBoYXMgYmVlbiBkZXRhY2hlZC5cbiAgc3RyZWFtLl9jbG9zZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgLy8gQ2xvc2UgcmVxdWVzdCBpcyByZW1vdmVkIGZyb20gX2Nsb3NlUmVxdWVzdCB3aGVuIGNsb3NlKCkgaXMgY2FsbGVkIG9uIHRoZSB1bmRlcmx5aW5nIHNpbmsuIFRoaXMgcHJldmVudHMgaXRcbiAgLy8gZnJvbSBiZWluZyBlcnJvbmVvdXNseSByZWplY3RlZCBvbiBlcnJvci4gSWYgYSBjbG9zZSgpIGNhbGwgaXMgaW4tZmxpZ2h0LCB0aGUgcmVxdWVzdCBpcyBzdG9yZWQgaGVyZS5cbiAgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICAvLyBUaGUgcHJvbWlzZSB0aGF0IHdhcyByZXR1cm5lZCBmcm9tIHdyaXRlci5hYm9ydCgpLiBUaGlzIG1heSBhbHNvIGJlIGZ1bGZpbGxlZCBhZnRlciB0aGUgd3JpdGVyIGhhcyBkZXRhY2hlZC5cbiAgc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuXG4gIC8vIFRoZSBiYWNrcHJlc3N1cmUgc2lnbmFsIHNldCBieSB0aGUgY29udHJvbGxlci5cbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmUgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gSXNXcml0YWJsZVN0cmVhbSh4OiB1bmtub3duKTogeCBpcyBXcml0YWJsZVN0cmVhbSB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ193cml0YWJsZVN0cmVhbUNvbnRyb2xsZXInKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgV3JpdGFibGVTdHJlYW07XG59XG5cbmZ1bmN0aW9uIElzV3JpdGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSk6IGJvb2xlYW4ge1xuICBhc3NlcnQoSXNXcml0YWJsZVN0cmVhbShzdHJlYW0pKTtcblxuICBpZiAoc3RyZWFtLl93cml0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUFib3J0KHN0cmVhbTogV3JpdGFibGVTdHJlYW0sIHJlYXNvbjogYW55KTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdjbG9zZWQnIHx8IHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIuX2Fib3J0UmVhc29uID0gcmVhc29uO1xuICBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlci5fYWJvcnRDb250cm9sbGVyPy5hYm9ydChyZWFzb24pO1xuXG4gIC8vIFR5cGVTY3JpcHQgbmFycm93cyB0aGUgdHlwZSBvZiBgc3RyZWFtLl9zdGF0ZWAgZG93biB0byAnd3JpdGFibGUnIHwgJ2Vycm9yaW5nJyxcbiAgLy8gYnV0IGl0IGRvZXNuJ3Qga25vdyB0aGF0IHNpZ25hbGluZyBhYm9ydCBydW5zIGF1dGhvciBjb2RlIHRoYXQgbWlnaHQgaGF2ZSBjaGFuZ2VkIHRoZSBzdGF0ZS5cbiAgLy8gV2lkZW4gdGhlIHR5cGUgYWdhaW4gYnkgY2FzdGluZyB0byBXcml0YWJsZVN0cmVhbVN0YXRlLlxuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGUgYXMgV3JpdGFibGVTdHJlYW1TdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnIHx8IHN0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIGlmIChzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QuX3Byb21pc2U7XG4gIH1cblxuICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RhdGUgPT09ICdlcnJvcmluZycpO1xuXG4gIGxldCB3YXNBbHJlYWR5RXJyb3JpbmcgPSBmYWxzZTtcbiAgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgd2FzQWxyZWFkeUVycm9yaW5nID0gdHJ1ZTtcbiAgICAvLyByZWFzb24gd2lsbCBub3QgYmUgdXNlZCwgc28gZG9uJ3Qga2VlcCBhIHJlZmVyZW5jZSB0byBpdC5cbiAgICByZWFzb24gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBwcm9taXNlID0gbmV3UHJvbWlzZTx1bmRlZmluZWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPSB7XG4gICAgICBfcHJvbWlzZTogdW5kZWZpbmVkISxcbiAgICAgIF9yZXNvbHZlOiByZXNvbHZlLFxuICAgICAgX3JlamVjdDogcmVqZWN0LFxuICAgICAgX3JlYXNvbjogcmVhc29uLFxuICAgICAgX3dhc0FscmVhZHlFcnJvcmluZzogd2FzQWxyZWFkeUVycm9yaW5nXG4gICAgfTtcbiAgfSk7XG4gIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCEuX3Byb21pc2UgPSBwcm9taXNlO1xuXG4gIGlmICghd2FzQWxyZWFkeUVycm9yaW5nKSB7XG4gICAgV3JpdGFibGVTdHJlYW1TdGFydEVycm9yaW5nKHN0cmVhbSwgcmVhc29uKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUNsb3NlKHN0cmVhbTogV3JpdGFibGVTdHJlYW08YW55Pik6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcbiAgaWYgKHN0YXRlID09PSAnY2xvc2VkJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgobmV3IFR5cGVFcnJvcihcbiAgICAgIGBUaGUgc3RyZWFtIChpbiAke3N0YXRlfSBzdGF0ZSkgaXMgbm90IGluIHRoZSB3cml0YWJsZSBzdGF0ZSBhbmQgY2Fubm90IGJlIGNsb3NlZGApKTtcbiAgfVxuXG4gIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG4gIGFzc2VydCghV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSk7XG5cbiAgY29uc3QgcHJvbWlzZSA9IG5ld1Byb21pc2U8dW5kZWZpbmVkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgY2xvc2VSZXF1ZXN0OiBDbG9zZVJlcXVlc3QgPSB7XG4gICAgICBfcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgIF9yZWplY3Q6IHJlamVjdFxuICAgIH07XG5cbiAgICBzdHJlYW0uX2Nsb3NlUmVxdWVzdCA9IGNsb3NlUmVxdWVzdDtcbiAgfSk7XG5cbiAgY29uc3Qgd3JpdGVyID0gc3RyZWFtLl93cml0ZXI7XG4gIGlmICh3cml0ZXIgIT09IHVuZGVmaW5lZCAmJiBzdHJlYW0uX2JhY2twcmVzc3VyZSAmJiBzdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNvbHZlKHdyaXRlcik7XG4gIH1cblxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2Uoc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG4vLyBXcml0YWJsZVN0cmVhbSBBUEkgZXhwb3NlZCBmb3IgY29udHJvbGxlcnMuXG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtQWRkV3JpdGVSZXF1ZXN0KHN0cmVhbTogV3JpdGFibGVTdHJlYW0pOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBhc3NlcnQoSXNXcml0YWJsZVN0cmVhbUxvY2tlZChzdHJlYW0pKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpO1xuXG4gIGNvbnN0IHByb21pc2UgPSBuZXdQcm9taXNlPHVuZGVmaW5lZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHdyaXRlUmVxdWVzdDogV3JpdGVSZXF1ZXN0ID0ge1xuICAgICAgX3Jlc29sdmU6IHJlc29sdmUsXG4gICAgICBfcmVqZWN0OiByZWplY3RcbiAgICB9O1xuXG4gICAgc3RyZWFtLl93cml0ZVJlcXVlc3RzLnB1c2god3JpdGVSZXF1ZXN0KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVhbFdpdGhSZWplY3Rpb24oc3RyZWFtOiBXcml0YWJsZVN0cmVhbSwgZXJyb3I6IGFueSkge1xuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG5cbiAgaWYgKHN0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgV3JpdGFibGVTdHJlYW1TdGFydEVycm9yaW5nKHN0cmVhbSwgZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGFzc2VydChzdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG4gIFdyaXRhYmxlU3RyZWFtRmluaXNoRXJyb3Jpbmcoc3RyZWFtKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1TdGFydEVycm9yaW5nKHN0cmVhbTogV3JpdGFibGVTdHJlYW0sIHJlYXNvbjogYW55KSB7XG4gIGFzc2VydChzdHJlYW0uX3N0b3JlZEVycm9yID09PSB1bmRlZmluZWQpO1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG5cbiAgY29uc3QgY29udHJvbGxlciA9IHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyO1xuICBhc3NlcnQoY29udHJvbGxlciAhPT0gdW5kZWZpbmVkKTtcblxuICBzdHJlYW0uX3N0YXRlID0gJ2Vycm9yaW5nJztcbiAgc3RyZWFtLl9zdG9yZWRFcnJvciA9IHJlYXNvbjtcbiAgY29uc3Qgd3JpdGVyID0gc3RyZWFtLl93cml0ZXI7XG4gIGlmICh3cml0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckVuc3VyZVJlYWR5UHJvbWlzZVJlamVjdGVkKHdyaXRlciwgcmVhc29uKTtcbiAgfVxuXG4gIGlmICghV3JpdGFibGVTdHJlYW1IYXNPcGVyYXRpb25NYXJrZWRJbkZsaWdodChzdHJlYW0pICYmIGNvbnRyb2xsZXIuX3N0YXJ0ZWQpIHtcbiAgICBXcml0YWJsZVN0cmVhbUZpbmlzaEVycm9yaW5nKHN0cmVhbSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1GaW5pc2hFcnJvcmluZyhzdHJlYW06IFdyaXRhYmxlU3RyZWFtKSB7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JpbmcnKTtcbiAgYXNzZXJ0KCFXcml0YWJsZVN0cmVhbUhhc09wZXJhdGlvbk1hcmtlZEluRmxpZ2h0KHN0cmVhbSkpO1xuICBzdHJlYW0uX3N0YXRlID0gJ2Vycm9yZWQnO1xuICBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlcltFcnJvclN0ZXBzXSgpO1xuXG4gIGNvbnN0IHN0b3JlZEVycm9yID0gc3RyZWFtLl9zdG9yZWRFcnJvcjtcbiAgc3RyZWFtLl93cml0ZVJlcXVlc3RzLmZvckVhY2god3JpdGVSZXF1ZXN0ID0+IHtcbiAgICB3cml0ZVJlcXVlc3QuX3JlamVjdChzdG9yZWRFcnJvcik7XG4gIH0pO1xuICBzdHJlYW0uX3dyaXRlUmVxdWVzdHMgPSBuZXcgU2ltcGxlUXVldWUoKTtcblxuICBpZiAoc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBXcml0YWJsZVN0cmVhbVJlamVjdENsb3NlQW5kQ2xvc2VkUHJvbWlzZUlmTmVlZGVkKHN0cmVhbSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYWJvcnRSZXF1ZXN0ID0gc3RyZWFtLl9wZW5kaW5nQWJvcnRSZXF1ZXN0O1xuICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKGFib3J0UmVxdWVzdC5fd2FzQWxyZWFkeUVycm9yaW5nKSB7XG4gICAgYWJvcnRSZXF1ZXN0Ll9yZWplY3Qoc3RvcmVkRXJyb3IpO1xuICAgIFdyaXRhYmxlU3RyZWFtUmVqZWN0Q2xvc2VBbmRDbG9zZWRQcm9taXNlSWZOZWVkZWQoc3RyZWFtKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwcm9taXNlID0gc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXJbQWJvcnRTdGVwc10oYWJvcnRSZXF1ZXN0Ll9yZWFzb24pO1xuICB1cG9uUHJvbWlzZShcbiAgICBwcm9taXNlLFxuICAgICgpID0+IHtcbiAgICAgIGFib3J0UmVxdWVzdC5fcmVzb2x2ZSgpO1xuICAgICAgV3JpdGFibGVTdHJlYW1SZWplY3RDbG9zZUFuZENsb3NlZFByb21pc2VJZk5lZWRlZChzdHJlYW0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICAocmVhc29uOiBhbnkpID0+IHtcbiAgICAgIGFib3J0UmVxdWVzdC5fcmVqZWN0KHJlYXNvbik7XG4gICAgICBXcml0YWJsZVN0cmVhbVJlamVjdENsb3NlQW5kQ2xvc2VkUHJvbWlzZUlmTmVlZGVkKHN0cmVhbSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodFdyaXRlKHN0cmVhbTogV3JpdGFibGVTdHJlYW0pIHtcbiAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgIT09IHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QhLl9yZXNvbHZlKHVuZGVmaW5lZCk7XG4gIHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRXcml0ZVdpdGhFcnJvcihzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCBlcnJvcjogYW55KSB7XG4gIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0ICE9PSB1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0V3JpdGVSZXF1ZXN0IS5fcmVqZWN0KGVycm9yKTtcbiAgc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JpbmcnKTtcblxuICBXcml0YWJsZVN0cmVhbURlYWxXaXRoUmVqZWN0aW9uKHN0cmVhbSwgZXJyb3IpO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUZpbmlzaEluRmxpZ2h0Q2xvc2Uoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSkge1xuICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCEuX3Jlc29sdmUodW5kZWZpbmVkKTtcbiAgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICBjb25zdCBzdGF0ZSA9IHN0cmVhbS5fc3RhdGU7XG5cbiAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnIHx8IHN0YXRlID09PSAnZXJyb3JpbmcnKTtcblxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmluZycpIHtcbiAgICAvLyBUaGUgZXJyb3Igd2FzIHRvbyBsYXRlIHRvIGRvIGFueXRoaW5nLCBzbyBpdCBpcyBpZ25vcmVkLlxuICAgIHN0cmVhbS5fc3RvcmVkRXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QuX3Jlc29sdmUoKTtcbiAgICAgIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBzdHJlYW0uX3N0YXRlID0gJ2Nsb3NlZCc7XG5cbiAgY29uc3Qgd3JpdGVyID0gc3RyZWFtLl93cml0ZXI7XG4gIGlmICh3cml0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVzb2x2ZSh3cml0ZXIpO1xuICB9XG5cbiAgYXNzZXJ0KHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdCA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RvcmVkRXJyb3IgPT09IHVuZGVmaW5lZCk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRDbG9zZVdpdGhFcnJvcihzdHJlYW06IFdyaXRhYmxlU3RyZWFtLCBlcnJvcjogYW55KSB7XG4gIGFzc2VydChzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ICE9PSB1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0IS5fcmVqZWN0KGVycm9yKTtcbiAgc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9IHVuZGVmaW5lZDtcblxuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JpbmcnKTtcblxuICAvLyBOZXZlciBleGVjdXRlIHNpbmsgYWJvcnQoKSBhZnRlciBzaW5rIGNsb3NlKCkuXG4gIGlmIChzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgIHN0cmVhbS5fcGVuZGluZ0Fib3J0UmVxdWVzdC5fcmVqZWN0KGVycm9yKTtcbiAgICBzdHJlYW0uX3BlbmRpbmdBYm9ydFJlcXVlc3QgPSB1bmRlZmluZWQ7XG4gIH1cbiAgV3JpdGFibGVTdHJlYW1EZWFsV2l0aFJlamVjdGlvbihzdHJlYW0sIGVycm9yKTtcbn1cblxuLy8gVE9ETyhyaWNlYSk6IEZpeCBhbHBoYWJldGljYWwgb3JkZXIuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW06IFdyaXRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGlmIChzdHJlYW0uX2Nsb3NlUmVxdWVzdCA9PT0gdW5kZWZpbmVkICYmIHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbUhhc09wZXJhdGlvbk1hcmtlZEluRmxpZ2h0KHN0cmVhbTogV3JpdGFibGVTdHJlYW0pOiBib29sZWFuIHtcbiAgaWYgKHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPT09IHVuZGVmaW5lZCAmJiBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1NYXJrQ2xvc2VSZXF1ZXN0SW5GbGlnaHQoc3RyZWFtOiBXcml0YWJsZVN0cmVhbSkge1xuICBhc3NlcnQoc3RyZWFtLl9pbkZsaWdodENsb3NlUmVxdWVzdCA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHN0cmVhbS5fY2xvc2VSZXF1ZXN0ICE9PSB1bmRlZmluZWQpO1xuICBzdHJlYW0uX2luRmxpZ2h0Q2xvc2VSZXF1ZXN0ID0gc3RyZWFtLl9jbG9zZVJlcXVlc3Q7XG4gIHN0cmVhbS5fY2xvc2VSZXF1ZXN0ID0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbU1hcmtGaXJzdFdyaXRlUmVxdWVzdEluRmxpZ2h0KHN0cmVhbTogV3JpdGFibGVTdHJlYW0pIHtcbiAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRXcml0ZVJlcXVlc3QgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChzdHJlYW0uX3dyaXRlUmVxdWVzdHMubGVuZ3RoICE9PSAwKTtcbiAgc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCA9IHN0cmVhbS5fd3JpdGVSZXF1ZXN0cy5zaGlmdCgpO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbVJlamVjdENsb3NlQW5kQ2xvc2VkUHJvbWlzZUlmTmVlZGVkKHN0cmVhbTogV3JpdGFibGVTdHJlYW0pIHtcbiAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmVkJyk7XG4gIGlmIChzdHJlYW0uX2Nsb3NlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYXNzZXJ0KHN0cmVhbS5faW5GbGlnaHRDbG9zZVJlcXVlc3QgPT09IHVuZGVmaW5lZCk7XG5cbiAgICBzdHJlYW0uX2Nsb3NlUmVxdWVzdC5fcmVqZWN0KHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICAgIHN0cmVhbS5fY2xvc2VSZXF1ZXN0ID0gdW5kZWZpbmVkO1xuICB9XG4gIGNvbnN0IHdyaXRlciA9IHN0cmVhbS5fd3JpdGVyO1xuICBpZiAod3JpdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlamVjdCh3cml0ZXIsIHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtVXBkYXRlQmFja3ByZXNzdXJlKHN0cmVhbTogV3JpdGFibGVTdHJlYW0sIGJhY2twcmVzc3VyZTogYm9vbGVhbikge1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG4gIGFzc2VydCghV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSk7XG5cbiAgY29uc3Qgd3JpdGVyID0gc3RyZWFtLl93cml0ZXI7XG4gIGlmICh3cml0ZXIgIT09IHVuZGVmaW5lZCAmJiBiYWNrcHJlc3N1cmUgIT09IHN0cmVhbS5fYmFja3ByZXNzdXJlKSB7XG4gICAgaWYgKGJhY2twcmVzc3VyZSkge1xuICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc2V0KHdyaXRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2VydCghYmFja3ByZXNzdXJlKTtcblxuICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlc29sdmUod3JpdGVyKTtcbiAgICB9XG4gIH1cblxuICBzdHJlYW0uX2JhY2twcmVzc3VyZSA9IGJhY2twcmVzc3VyZTtcbn1cblxuLyoqXG4gKiBBIGRlZmF1bHQgd3JpdGVyIHZlbmRlZCBieSBhIHtAbGluayBXcml0YWJsZVN0cmVhbX0uXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyPFcgPSBhbnk+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb3duZXJXcml0YWJsZVN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2UhOiBQcm9taXNlPHVuZGVmaW5lZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VfcmVzb2x2ZT86ICh2YWx1ZT86IHVuZGVmaW5lZCkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VkUHJvbWlzZV9yZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Nsb3NlZFByb21pc2VTdGF0ZSE6ICdwZW5kaW5nJyB8ICdyZXNvbHZlZCcgfCAncmVqZWN0ZWQnO1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkeVByb21pc2UhOiBQcm9taXNlPHVuZGVmaW5lZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlYWR5UHJvbWlzZV9yZXNvbHZlPzogKHZhbHVlPzogdW5kZWZpbmVkKSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkeVByb21pc2VfcmVqZWN0PzogKHJlYXNvbjogYW55KSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkeVByb21pc2VTdGF0ZSE6ICdwZW5kaW5nJyB8ICdmdWxmaWxsZWQnIHwgJ3JlamVjdGVkJztcblxuICBjb25zdHJ1Y3RvcihzdHJlYW06IFdyaXRhYmxlU3RyZWFtPFc+KSB7XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChzdHJlYW0sIDEsICdXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXInKTtcbiAgICBhc3NlcnRXcml0YWJsZVN0cmVhbShzdHJlYW0sICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIGlmIChJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHN0cmVhbSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXMgc3RyZWFtIGhhcyBhbHJlYWR5IGJlZW4gbG9ja2VkIGZvciBleGNsdXNpdmUgd3JpdGluZyBieSBhbm90aGVyIHdyaXRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuX293bmVyV3JpdGFibGVTdHJlYW0gPSBzdHJlYW07XG4gICAgc3RyZWFtLl93cml0ZXIgPSB0aGlzO1xuXG4gICAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuXG4gICAgaWYgKHN0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgICBpZiAoIVdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkgJiYgc3RyZWFtLl9iYWNrcHJlc3N1cmUpIHtcbiAgICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemUodGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZSh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQodGhpcywgc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gICAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUodGhpcyk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICAgIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplQXNSZXNvbHZlZCh0aGlzKTtcbiAgICAgIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVzb2x2ZWQodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2VydChzdGF0ZSA9PT0gJ2Vycm9yZWQnKTtcblxuICAgICAgY29uc3Qgc3RvcmVkRXJyb3IgPSBzdHJlYW0uX3N0b3JlZEVycm9yO1xuICAgICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHRoaXMsIHN0b3JlZEVycm9yKTtcbiAgICAgIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQodGhpcywgc3RvcmVkRXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmUgZnVsZmlsbGVkIHdoZW4gdGhlIHN0cmVhbSBiZWNvbWVzIGNsb3NlZCwgb3IgcmVqZWN0ZWQgaWYgdGhlIHN0cmVhbSBldmVyIGVycm9ycyBvclxuICAgKiB0aGUgd3JpdGVy4oCZcyBsb2NrIGlzIHJlbGVhc2VkIGJlZm9yZSB0aGUgc3RyZWFtIGZpbmlzaGVzIGNsb3NpbmcuXG4gICAqL1xuICBnZXQgY2xvc2VkKCk6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Nsb3NlZCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY2xvc2VkUHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXNpcmVkIHNpemUgdG8gZmlsbCB0aGUgc3RyZWFt4oCZcyBpbnRlcm5hbCBxdWV1ZS4gSXQgY2FuIGJlIG5lZ2F0aXZlLCBpZiB0aGUgcXVldWUgaXMgb3Zlci1mdWxsLlxuICAgKiBBIHByb2R1Y2VyIGNhbiB1c2UgdGhpcyBpbmZvcm1hdGlvbiB0byBkZXRlcm1pbmUgdGhlIHJpZ2h0IGFtb3VudCBvZiBkYXRhIHRvIHdyaXRlLlxuICAgKlxuICAgKiBJdCB3aWxsIGJlIGBudWxsYCBpZiB0aGUgc3RyZWFtIGNhbm5vdCBiZSBzdWNjZXNzZnVsbHkgd3JpdHRlbiB0byAoZHVlIHRvIGVpdGhlciBiZWluZyBlcnJvcmVkLCBvciBoYXZpbmcgYW4gYWJvcnRcbiAgICogcXVldWVkIHVwKS4gSXQgd2lsbCByZXR1cm4gemVybyBpZiB0aGUgc3RyZWFtIGlzIGNsb3NlZC4gQW5kIHRoZSBnZXR0ZXIgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgaW52b2tlZCB3aGVuXG4gICAqIHRoZSB3cml0ZXLigJlzIGxvY2sgaXMgcmVsZWFzZWQuXG4gICAqL1xuICBnZXQgZGVzaXJlZFNpemUoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Rlc2lyZWRTaXplJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyV3JpdGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgZGVmYXVsdFdyaXRlckxvY2tFeGNlcHRpb24oJ2Rlc2lyZWRTaXplJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckdldERlc2lyZWRTaXplKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGUgZGVzaXJlZCBzaXplIHRvIGZpbGwgdGhlIHN0cmVhbeKAmXMgaW50ZXJuYWwgcXVldWUgdHJhbnNpdGlvbnNcbiAgICogZnJvbSBub24tcG9zaXRpdmUgdG8gcG9zaXRpdmUsIHNpZ25hbGluZyB0aGF0IGl0IGlzIG5vIGxvbmdlciBhcHBseWluZyBiYWNrcHJlc3N1cmUuIE9uY2UgdGhlIGRlc2lyZWQgc2l6ZSBkaXBzXG4gICAqIGJhY2sgdG8gemVybyBvciBiZWxvdywgdGhlIGdldHRlciB3aWxsIHJldHVybiBhIG5ldyBwcm9taXNlIHRoYXQgc3RheXMgcGVuZGluZyB1bnRpbCB0aGUgbmV4dCB0cmFuc2l0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgc3RyZWFtIGJlY29tZXMgZXJyb3JlZCBvciBhYm9ydGVkLCBvciB0aGUgd3JpdGVy4oCZcyBsb2NrIGlzIHJlbGVhc2VkLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlY29tZVxuICAgKiByZWplY3RlZC5cbiAgICovXG4gIGdldCByZWFkeSgpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdyZWFkeScpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcmVhZHlQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSByZWFkZXIgaXMgYWN0aXZlLCBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBXcml0YWJsZVN0cmVhbS5hYm9ydCB8IHN0cmVhbS5hYm9ydChyZWFzb24pfS5cbiAgICovXG4gIGFib3J0KHJlYXNvbjogYW55ID0gdW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcih0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckJyYW5kQ2hlY2tFeGNlcHRpb24oJ2Fib3J0JykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKCdhYm9ydCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQWJvcnQodGhpcywgcmVhc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiB0aGUgcmVhZGVyIGlzIGFjdGl2ZSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgV3JpdGFibGVTdHJlYW0uY2xvc2UgfCBzdHJlYW0uY2xvc2UoKX0uXG4gICAqL1xuICBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbignY2xvc2UnKSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICAgIGlmIChzdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckxvY2tFeGNlcHRpb24oJ2Nsb3NlJykpO1xuICAgIH1cblxuICAgIGlmIChXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2xvc2UgYW4gYWxyZWFkeS1jbG9zaW5nIHN0cmVhbScpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2UodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZXMgdGhlIHdyaXRlcuKAmXMgbG9jayBvbiB0aGUgY29ycmVzcG9uZGluZyBzdHJlYW0uIEFmdGVyIHRoZSBsb2NrIGlzIHJlbGVhc2VkLCB0aGUgd3JpdGVyIGlzIG5vIGxvbmdlciBhY3RpdmUuXG4gICAqIElmIHRoZSBhc3NvY2lhdGVkIHN0cmVhbSBpcyBlcnJvcmVkIHdoZW4gdGhlIGxvY2sgaXMgcmVsZWFzZWQsIHRoZSB3cml0ZXIgd2lsbCBhcHBlYXIgZXJyb3JlZCBpbiB0aGUgc2FtZSB3YXkgZnJvbVxuICAgKiBub3cgb247IG90aGVyd2lzZSwgdGhlIHdyaXRlciB3aWxsIGFwcGVhciBjbG9zZWQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgbG9jayBjYW4gc3RpbGwgYmUgcmVsZWFzZWQgZXZlbiBpZiBzb21lIG9uZ29pbmcgd3JpdGVzIGhhdmUgbm90IHlldCBmaW5pc2hlZCAoaS5lLiBldmVuIGlmIHRoZVxuICAgKiBwcm9taXNlcyByZXR1cm5lZCBmcm9tIHByZXZpb3VzIGNhbGxzIHRvIHtAbGluayBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIud3JpdGUgfCB3cml0ZSgpfSBoYXZlIG5vdCB5ZXQgc2V0dGxlZCkuXG4gICAqIEl04oCZcyBub3QgbmVjZXNzYXJ5IHRvIGhvbGQgdGhlIGxvY2sgb24gdGhlIHdyaXRlciBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSB3cml0ZTsgdGhlIGxvY2sgaW5zdGVhZCBzaW1wbHkgcHJldmVudHNcbiAgICogb3RoZXIgcHJvZHVjZXJzIGZyb20gd3JpdGluZyBpbiBhbiBpbnRlcmxlYXZlZCBtYW5uZXIuXG4gICAqL1xuICByZWxlYXNlTG9jaygpOiB2b2lkIHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpKSB7XG4gICAgICB0aHJvdyBkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbigncmVsZWFzZUxvY2snKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuXG4gICAgaWYgKHN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXNzZXJ0KHN0cmVhbS5fd3JpdGVyICE9PSB1bmRlZmluZWQpO1xuXG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyUmVsZWFzZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgdGhlIGdpdmVuIGNodW5rIHRvIHRoZSB3cml0YWJsZSBzdHJlYW0sIGJ5IHdhaXRpbmcgdW50aWwgYW55IHByZXZpb3VzIHdyaXRlcyBoYXZlIGZpbmlzaGVkIHN1Y2Nlc3NmdWxseSxcbiAgICogYW5kIHRoZW4gc2VuZGluZyB0aGUgY2h1bmsgdG8gdGhlIHVuZGVybHlpbmcgc2luaydzIHtAbGluayBVbmRlcmx5aW5nU2luay53cml0ZSB8IHdyaXRlKCl9IG1ldGhvZC4gSXQgd2lsbCByZXR1cm5cbiAgICogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2l0aCB1bmRlZmluZWQgdXBvbiBhIHN1Y2Nlc3NmdWwgd3JpdGUsIG9yIHJlamVjdHMgaWYgdGhlIHdyaXRlIGZhaWxzIG9yIHN0cmVhbSBiZWNvbWVzXG4gICAqIGVycm9yZWQgYmVmb3JlIHRoZSB3cml0aW5nIHByb2Nlc3MgaXMgaW5pdGlhdGVkLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgd2hhdCBcInN1Y2Nlc3NcIiBtZWFucyBpcyB1cCB0byB0aGUgdW5kZXJseWluZyBzaW5rOyBpdCBtaWdodCBpbmRpY2F0ZSBzaW1wbHkgdGhhdCB0aGUgY2h1bmsgaGFzIGJlZW5cbiAgICogYWNjZXB0ZWQsIGFuZCBub3QgbmVjZXNzYXJpbHkgdGhhdCBpdCBpcyBzYWZlbHkgc2F2ZWQgdG8gaXRzIHVsdGltYXRlIGRlc3RpbmF0aW9uLlxuICAgKi9cbiAgd3JpdGUoY2h1bms6IFcpOiBQcm9taXNlPHZvaWQ+O1xuICB3cml0ZShjaHVuazogVyA9IHVuZGVmaW5lZCEpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbignd3JpdGUnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX293bmVyV3JpdGFibGVTdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZGVmYXVsdFdyaXRlckxvY2tFeGNlcHRpb24oJ3dyaXRlIHRvJykpO1xuICAgIH1cblxuICAgIHJldHVybiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJXcml0ZSh0aGlzLCBjaHVuayk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZSwge1xuICBhYm9ydDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGNsb3NlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVsZWFzZUxvY2s6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICB3cml0ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGNsb3NlZDogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGRlc2lyZWRTaXplOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcmVhZHk6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIucHJvdG90eXBlLmFib3J0LCAnYWJvcnQnKTtcbnNldEZ1bmN0aW9uTmFtZShXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIucHJvdG90eXBlLmNsb3NlLCAnY2xvc2UnKTtcbnNldEZ1bmN0aW9uTmFtZShXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIucHJvdG90eXBlLnJlbGVhc2VMb2NrLCAncmVsZWFzZUxvY2snKTtcbnNldEZ1bmN0aW9uTmFtZShXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIucHJvdG90eXBlLndyaXRlLCAnd3JpdGUnKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXInLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlci5cblxuZnVuY3Rpb24gSXNXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8VyA9IGFueT4oeDogYW55KTogeCBpcyBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8Vz4ge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfb3duZXJXcml0YWJsZVN0cmVhbScpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHggaW5zdGFuY2VvZiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI7XG59XG5cbi8vIEEgY2xpZW50IG9mIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciBtYXkgdXNlIHRoZXNlIGZ1bmN0aW9ucyBkaXJlY3RseSB0byBieXBhc3Mgc3RhdGUgY2hlY2suXG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckFib3J0KHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCByZWFzb246IGFueSkge1xuICBjb25zdCBzdHJlYW0gPSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW07XG5cbiAgYXNzZXJ0KHN0cmVhbSAhPT0gdW5kZWZpbmVkKTtcblxuICByZXR1cm4gV3JpdGFibGVTdHJlYW1BYm9ydChzdHJlYW0sIHJlYXNvbik7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckNsb3NlKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgY29uc3Qgc3RyZWFtID0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuXG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG5cbiAgcmV0dXJuIFdyaXRhYmxlU3RyZWFtQ2xvc2Uoc3RyZWFtKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyQ2xvc2VXaXRoRXJyb3JQcm9wYWdhdGlvbih3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcik6IFByb21pc2U8dW5kZWZpbmVkPiB7XG4gIGNvbnN0IHN0cmVhbSA9IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbTtcblxuICBhc3NlcnQoc3RyZWFtICE9PSB1bmRlZmluZWQpO1xuXG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcbiAgaWYgKFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0KHN0cmVhbSkgfHwgc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yZWQnKSB7XG4gICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gIH1cblxuICBhc3NlcnQoc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RhdGUgPT09ICdlcnJvcmluZycpO1xuXG4gIHJldHVybiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJDbG9zZSh3cml0ZXIpO1xufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJFbnN1cmVDbG9zZWRQcm9taXNlUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIGVycm9yOiBhbnkpIHtcbiAgaWYgKHdyaXRlci5fY2xvc2VkUHJvbWlzZVN0YXRlID09PSAncGVuZGluZycpIHtcbiAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlamVjdCh3cml0ZXIsIGVycm9yKTtcbiAgfSBlbHNlIHtcbiAgICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZVJlc2V0VG9SZWplY3RlZCh3cml0ZXIsIGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJFbnN1cmVSZWFkeVByb21pc2VSZWplY3RlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgZXJyb3I6IGFueSkge1xuICBpZiAod3JpdGVyLl9yZWFkeVByb21pc2VTdGF0ZSA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlamVjdCh3cml0ZXIsIGVycm9yKTtcbiAgfSBlbHNlIHtcbiAgICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzZXRUb1JlamVjdGVkKHdyaXRlciwgZXJyb3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlckdldERlc2lyZWRTaXplKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IHN0cmVhbSA9IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbTtcbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuXG4gIGlmIChzdGF0ZSA9PT0gJ2Vycm9yZWQnIHx8IHN0YXRlID09PSAnZXJyb3JpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICByZXR1cm4gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyUmVsZWFzZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICBjb25zdCBzdHJlYW0gPSB3cml0ZXIuX293bmVyV3JpdGFibGVTdHJlYW07XG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydChzdHJlYW0uX3dyaXRlciA9PT0gd3JpdGVyKTtcblxuICBjb25zdCByZWxlYXNlZEVycm9yID0gbmV3IFR5cGVFcnJvcihcbiAgICBgV3JpdGVyIHdhcyByZWxlYXNlZCBhbmQgY2FuIG5vIGxvbmdlciBiZSB1c2VkIHRvIG1vbml0b3IgdGhlIHN0cmVhbSdzIGNsb3NlZG5lc3NgKTtcblxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJFbnN1cmVSZWFkeVByb21pc2VSZWplY3RlZCh3cml0ZXIsIHJlbGVhc2VkRXJyb3IpO1xuXG4gIC8vIFRoZSBzdGF0ZSB0cmFuc2l0aW9ucyB0byBcImVycm9yZWRcIiBiZWZvcmUgdGhlIHNpbmsgYWJvcnQoKSBtZXRob2QgcnVucywgYnV0IHRoZSB3cml0ZXIuY2xvc2VkIHByb21pc2UgaXMgbm90XG4gIC8vIHJlamVjdGVkIHVudGlsIGFmdGVyd2FyZHMuIFRoaXMgbWVhbnMgdGhhdCBzaW1wbHkgdGVzdGluZyBzdGF0ZSB3aWxsIG5vdCB3b3JrLlxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJFbnN1cmVDbG9zZWRQcm9taXNlUmVqZWN0ZWQod3JpdGVyLCByZWxlYXNlZEVycm9yKTtcblxuICBzdHJlYW0uX3dyaXRlciA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtID0gdW5kZWZpbmVkITtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyV3JpdGU8Vz4od3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8Vz4sIGNodW5rOiBXKTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgY29uc3Qgc3RyZWFtID0gd3JpdGVyLl9vd25lcldyaXRhYmxlU3RyZWFtO1xuXG4gIGFzc2VydChzdHJlYW0gIT09IHVuZGVmaW5lZCk7XG5cbiAgY29uc3QgY29udHJvbGxlciA9IHN0cmVhbS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyO1xuXG4gIGNvbnN0IGNodW5rU2l6ZSA9IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXRDaHVua1NpemUoY29udHJvbGxlciwgY2h1bmspO1xuXG4gIGlmIChzdHJlYW0gIT09IHdyaXRlci5fb3duZXJXcml0YWJsZVN0cmVhbSkge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGRlZmF1bHRXcml0ZXJMb2NrRXhjZXB0aW9uKCd3cml0ZSB0bycpKTtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcbiAgaWYgKHN0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfVxuICBpZiAoV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoc3RyZWFtKSB8fCBzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdUaGUgc3RyZWFtIGlzIGNsb3Npbmcgb3IgY2xvc2VkIGFuZCBjYW5ub3QgYmUgd3JpdHRlbiB0bycpKTtcbiAgfVxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmluZycpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChzdHJlYW0uX3N0b3JlZEVycm9yKTtcbiAgfVxuXG4gIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyk7XG5cbiAgY29uc3QgcHJvbWlzZSA9IFdyaXRhYmxlU3RyZWFtQWRkV3JpdGVSZXF1ZXN0KHN0cmVhbSk7XG5cbiAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcldyaXRlKGNvbnRyb2xsZXIsIGNodW5rLCBjaHVua1NpemUpO1xuXG4gIHJldHVybiBwcm9taXNlO1xufVxuXG5jb25zdCBjbG9zZVNlbnRpbmVsOiB1bmlxdWUgc3ltYm9sID0ge30gYXMgYW55O1xuXG50eXBlIFF1ZXVlUmVjb3JkPFc+ID0gVyB8IHR5cGVvZiBjbG9zZVNlbnRpbmVsO1xuXG4vKipcbiAqIEFsbG93cyBjb250cm9sIG9mIGEge0BsaW5rIFdyaXRhYmxlU3RyZWFtIHwgd3JpdGFibGUgc3RyZWFtfSdzIHN0YXRlIGFuZCBpbnRlcm5hbCBxdWV1ZS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFcgPSBhbnk+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtITogV3JpdGFibGVTdHJlYW08Vz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3F1ZXVlITogU2ltcGxlUXVldWU8UXVldWVQYWlyPFF1ZXVlUmVjb3JkPFc+Pj47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3F1ZXVlVG90YWxTaXplITogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIF9hYm9ydFJlYXNvbjogYW55O1xuICAvKiogQGludGVybmFsICovXG4gIF9hYm9ydENvbnRyb2xsZXI6IEFib3J0Q29udHJvbGxlciB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RhcnRlZCE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobSE6IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxXPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3lIV00hOiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3dyaXRlQWxnb3JpdGhtITogKGNodW5rOiBXKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jbG9zZUFsZ29yaXRobSE6ICgpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2Fib3J0QWxnb3JpdGhtITogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSWxsZWdhbCBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZWFzb24gd2hpY2ggd2FzIHBhc3NlZCB0byBgV3JpdGFibGVTdHJlYW0uYWJvcnQocmVhc29uKWAgd2hlbiB0aGUgc3RyZWFtIHdhcyBhYm9ydGVkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiAgVGhpcyBwcm9wZXJ0eSBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHNwZWNpZmljYXRpb24sIHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2hhdHdnL3N0cmVhbXMvcHVsbC8xMTc3LlxuICAgKiAgVXNlIHtAbGluayBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnNpZ25hbH0ncyBgcmVhc29uYCBpbnN0ZWFkLlxuICAgKi9cbiAgZ2V0IGFib3J0UmVhc29uKCk6IGFueSB7XG4gICAgaWYgKCFJc1dyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignYWJvcnRSZWFzb24nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Fib3J0UmVhc29uO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGBBYm9ydFNpZ25hbGAgdGhhdCBjYW4gYmUgdXNlZCB0byBhYm9ydCB0aGUgcGVuZGluZyB3cml0ZSBvciBjbG9zZSBvcGVyYXRpb24gd2hlbiB0aGUgc3RyZWFtIGlzIGFib3J0ZWQuXG4gICAqL1xuICBnZXQgc2lnbmFsKCk6IEFib3J0U2lnbmFsIHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdzaWduYWwnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2Fib3J0Q29udHJvbGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBPbGRlciBicm93c2VycyBvciBvbGRlciBOb2RlIHZlcnNpb25zIG1heSBub3Qgc3VwcG9ydCBgQWJvcnRDb250cm9sbGVyYCBvciBgQWJvcnRTaWduYWxgLlxuICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBidW5kbGUgYW5kIHNoaXAgYW4gYEFib3J0Q29udHJvbGxlcmAgcG9seWZpbGwgdG9nZXRoZXIgd2l0aCBvdXIgcG9seWZpbGwsXG4gICAgICAvLyBzbyBpbnN0ZWFkIHdlIG9ubHkgaW1wbGVtZW50IHN1cHBvcnQgZm9yIGBzaWduYWxgIGlmIHdlIGZpbmQgYSBnbG9iYWwgYEFib3J0Q29udHJvbGxlcmAgY29uc3RydWN0b3IuXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5zaWduYWwgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGNvbnRyb2xsZWQgd3JpdGFibGUgc3RyZWFtLCBtYWtpbmcgYWxsIGZ1dHVyZSBpbnRlcmFjdGlvbnMgd2l0aCBpdCBmYWlsIHdpdGggdGhlIGdpdmVuIGVycm9yIGBlYC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgcmFyZWx5IHVzZWQsIHNpbmNlIHVzdWFsbHkgaXQgc3VmZmljZXMgdG8gcmV0dXJuIGEgcmVqZWN0ZWQgcHJvbWlzZSBmcm9tIG9uZSBvZiB0aGUgdW5kZXJseWluZ1xuICAgKiBzaW5rJ3MgbWV0aG9kcy4gSG93ZXZlciwgaXQgY2FuIGJlIHVzZWZ1bCBmb3Igc3VkZGVubHkgc2h1dHRpbmcgZG93biBhIHN0cmVhbSBpbiByZXNwb25zZSB0byBhbiBldmVudCBvdXRzaWRlIHRoZVxuICAgKiBub3JtYWwgbGlmZWN5Y2xlIG9mIGludGVyYWN0aW9ucyB3aXRoIHRoZSB1bmRlcmx5aW5nIHNpbmsuXG4gICAqL1xuICBlcnJvcihlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAoIUlzV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdlcnJvcicpO1xuICAgIH1cbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbS5fc3RhdGU7XG4gICAgaWYgKHN0YXRlICE9PSAnd3JpdGFibGUnKSB7XG4gICAgICAvLyBUaGUgc3RyZWFtIGlzIGNsb3NlZCwgZXJyb3JlZCBvciB3aWxsIGJlIHNvb24uIFRoZSBzaW5rIGNhbid0IGRvIGFueXRoaW5nIHVzZWZ1bCBpZiBpdCBnZXRzIGFuIGVycm9yIGhlcmUsIHNvXG4gICAgICAvLyBqdXN0IHRyZWF0IGl0IGFzIGEgbm8tb3AuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHRoaXMsIGUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBbQWJvcnRTdGVwc10ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9hYm9ydEFsZ29yaXRobShyZWFzb24pO1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXModGhpcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW0Vycm9yU3RlcHNdKCkge1xuICAgIFJlc2V0UXVldWUodGhpcyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUsIHtcbiAgYWJvcnRSZWFzb246IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBzaWduYWw6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBlcnJvcjogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5cbi8vIEFic3RyYWN0IG9wZXJhdGlvbnMgaW1wbGVtZW50aW5nIGludGVyZmFjZSByZXF1aXJlZCBieSB0aGUgV3JpdGFibGVTdHJlYW0uXG5cbmZ1bmN0aW9uIElzV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcih4OiBhbnkpOiB4IGlzIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PiB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19jb250cm9sbGVkV3JpdGFibGVTdHJlYW0nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjtcbn1cblxuZnVuY3Rpb24gU2V0VXBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+KHN0cmVhbTogV3JpdGFibGVTdHJlYW08Vz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxXPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydEFsZ29yaXRobTogKCkgPT4gdm9pZCB8IFByb21pc2VMaWtlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlQWxnb3JpdGhtOiAoY2h1bms6IFcpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWJvcnRBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoV2F0ZXJNYXJrOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFc+KSB7XG4gIGFzc2VydChJc1dyaXRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuICBhc3NlcnQoc3RyZWFtLl93cml0YWJsZVN0cmVhbUNvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCk7XG5cbiAgY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtID0gc3RyZWFtO1xuICBzdHJlYW0uX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG5cbiAgLy8gTmVlZCB0byBzZXQgdGhlIHNsb3RzIHNvIHRoYXQgdGhlIGFzc2VydCBkb2Vzbid0IGZpcmUuIEluIHRoZSBzcGVjIHRoZSBzbG90cyBhbHJlYWR5IGV4aXN0IGltcGxpY2l0bHkuXG4gIGNvbnRyb2xsZXIuX3F1ZXVlID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fcXVldWVUb3RhbFNpemUgPSB1bmRlZmluZWQhO1xuICBSZXNldFF1ZXVlKGNvbnRyb2xsZXIpO1xuXG4gIGNvbnRyb2xsZXIuX2Fib3J0UmVhc29uID0gdW5kZWZpbmVkO1xuICBjb250cm9sbGVyLl9hYm9ydENvbnRyb2xsZXIgPSBjcmVhdGVBYm9ydENvbnRyb2xsZXIoKTtcbiAgY29udHJvbGxlci5fc3RhcnRlZCA9IGZhbHNlO1xuXG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobSA9IHNpemVBbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5SFdNID0gaGlnaFdhdGVyTWFyaztcblxuICBjb250cm9sbGVyLl93cml0ZUFsZ29yaXRobSA9IHdyaXRlQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9jbG9zZUFsZ29yaXRobSA9IGNsb3NlQWxnb3JpdGhtO1xuICBjb250cm9sbGVyLl9hYm9ydEFsZ29yaXRobSA9IGFib3J0QWxnb3JpdGhtO1xuXG4gIGNvbnN0IGJhY2twcmVzc3VyZSA9IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXRCYWNrcHJlc3N1cmUoY29udHJvbGxlcik7XG4gIFdyaXRhYmxlU3RyZWFtVXBkYXRlQmFja3ByZXNzdXJlKHN0cmVhbSwgYmFja3ByZXNzdXJlKTtcblxuICBjb25zdCBzdGFydFJlc3VsdCA9IHN0YXJ0QWxnb3JpdGhtKCk7XG4gIGNvbnN0IHN0YXJ0UHJvbWlzZSA9IHByb21pc2VSZXNvbHZlZFdpdGgoc3RhcnRSZXN1bHQpO1xuICB1cG9uUHJvbWlzZShcbiAgICBzdGFydFByb21pc2UsXG4gICAgKCkgPT4ge1xuICAgICAgYXNzZXJ0KHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScgfHwgc3RyZWFtLl9zdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG4gICAgICBjb250cm9sbGVyLl9zdGFydGVkID0gdHJ1ZTtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJBZHZhbmNlUXVldWVJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgciA9PiB7XG4gICAgICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdHJlYW0uX3N0YXRlID09PSAnZXJyb3JpbmcnKTtcbiAgICAgIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgV3JpdGFibGVTdHJlYW1EZWFsV2l0aFJlamVjdGlvbihzdHJlYW0sIHIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiBTZXRVcFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1Npbms8Vz4oc3RyZWFtOiBXcml0YWJsZVN0cmVhbTxXPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlcmx5aW5nU2luazogVmFsaWRhdGVkVW5kZXJseWluZ1Npbms8Vz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxXPikge1xuICBjb25zdCBjb250cm9sbGVyID0gT2JqZWN0LmNyZWF0ZShXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgbGV0IHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD47XG4gIGxldCB3cml0ZUFsZ29yaXRobTogKGNodW5rOiBXKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgY2xvc2VBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGxldCBhYm9ydEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIGlmICh1bmRlcmx5aW5nU2luay5zdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnRBbGdvcml0aG0gPSAoKSA9PiB1bmRlcmx5aW5nU2luay5zdGFydCEoY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgc3RhcnRBbGdvcml0aG0gPSAoKSA9PiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdTaW5rLndyaXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICB3cml0ZUFsZ29yaXRobSA9IGNodW5rID0+IHVuZGVybHlpbmdTaW5rLndyaXRlIShjaHVuaywgY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgd3JpdGVBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdTaW5rLmNsb3NlICE9PSB1bmRlZmluZWQpIHtcbiAgICBjbG9zZUFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdTaW5rLmNsb3NlISgpO1xuICB9IGVsc2Uge1xuICAgIGNsb3NlQWxnb3JpdGhtID0gKCkgPT4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG4gIGlmICh1bmRlcmx5aW5nU2luay5hYm9ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYWJvcnRBbGdvcml0aG0gPSByZWFzb24gPT4gdW5kZXJseWluZ1NpbmsuYWJvcnQhKHJlYXNvbik7XG4gIH0gZWxzZSB7XG4gICAgYWJvcnRBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBTZXRVcFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoXG4gICAgc3RyZWFtLCBjb250cm9sbGVyLCBzdGFydEFsZ29yaXRobSwgd3JpdGVBbGdvcml0aG0sIGNsb3NlQWxnb3JpdGhtLCBhYm9ydEFsZ29yaXRobSwgaGlnaFdhdGVyTWFyaywgc2l6ZUFsZ29yaXRobVxuICApO1xufVxuXG4vLyBDbGVhckFsZ29yaXRobXMgbWF5IGJlIGNhbGxlZCB0d2ljZS4gRXJyb3JpbmcgdGhlIHNhbWUgc3RyZWFtIGluIG11bHRpcGxlIHdheXMgd2lsbCBvZnRlbiByZXN1bHQgaW4gcmVkdW5kYW50IGNhbGxzLlxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pIHtcbiAgY29udHJvbGxlci5fd3JpdGVBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9jbG9zZUFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX2Fib3J0QWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fc3RyYXRlZ3lTaXplQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlPFc+KGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Vz4pIHtcbiAgRW5xdWV1ZVZhbHVlV2l0aFNpemUoY29udHJvbGxlciwgY2xvc2VTZW50aW5lbCwgMCk7XG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJBZHZhbmNlUXVldWVJZk5lZWRlZChjb250cm9sbGVyKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldENodW5rU2l6ZTxXPihjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHVuazogVyk6IG51bWJlciB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNvbnRyb2xsZXIuX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobShjaHVuayk7XG4gIH0gY2F0Y2ggKGNodW5rU2l6ZUUpIHtcbiAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZChjb250cm9sbGVyLCBjaHVua1NpemVFKTtcbiAgICByZXR1cm4gMTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KTogbnVtYmVyIHtcbiAgcmV0dXJuIGNvbnRyb2xsZXIuX3N0cmF0ZWd5SFdNIC0gY29udHJvbGxlci5fcXVldWVUb3RhbFNpemU7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJXcml0ZTxXPihjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rOiBXLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rU2l6ZTogbnVtYmVyKSB7XG4gIHRyeSB7XG4gICAgRW5xdWV1ZVZhbHVlV2l0aFNpemUoY29udHJvbGxlciwgY2h1bmssIGNodW5rU2l6ZSk7XG4gIH0gY2F0Y2ggKGVucXVldWVFKSB7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQoY29udHJvbGxlciwgZW5xdWV1ZUUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbTtcbiAgaWYgKCFXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pICYmIHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICBjb25zdCBiYWNrcHJlc3N1cmUgPSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0QmFja3ByZXNzdXJlKGNvbnRyb2xsZXIpO1xuICAgIFdyaXRhYmxlU3RyZWFtVXBkYXRlQmFja3ByZXNzdXJlKHN0cmVhbSwgYmFja3ByZXNzdXJlKTtcbiAgfVxuXG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJBZHZhbmNlUXVldWVJZk5lZWRlZChjb250cm9sbGVyKTtcbn1cblxuLy8gQWJzdHJhY3Qgb3BlcmF0aW9ucyBmb3IgdGhlIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIuXG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJBZHZhbmNlUXVldWVJZk5lZWRlZDxXPihjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+KSB7XG4gIGNvbnN0IHN0cmVhbSA9IGNvbnRyb2xsZXIuX2NvbnRyb2xsZWRXcml0YWJsZVN0cmVhbTtcblxuICBpZiAoIWNvbnRyb2xsZXIuX3N0YXJ0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoc3RyZWFtLl9pbkZsaWdodFdyaXRlUmVxdWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhdGUgPSBzdHJlYW0uX3N0YXRlO1xuICBhc3NlcnQoc3RhdGUgIT09ICdjbG9zZWQnICYmIHN0YXRlICE9PSAnZXJyb3JlZCcpO1xuICBpZiAoc3RhdGUgPT09ICdlcnJvcmluZycpIHtcbiAgICBXcml0YWJsZVN0cmVhbUZpbmlzaEVycm9yaW5nKHN0cmVhbSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNvbnRyb2xsZXIuX3F1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHZhbHVlID0gUGVla1F1ZXVlVmFsdWUoY29udHJvbGxlcik7XG4gIGlmICh2YWx1ZSA9PT0gY2xvc2VTZW50aW5lbCkge1xuICAgIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQcm9jZXNzQ2xvc2UoY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclByb2Nlc3NXcml0ZShjb250cm9sbGVyLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+LCBlcnJvcjogYW55KSB7XG4gIGlmIChjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXIsIGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyUHJvY2Vzc0Nsb3NlKGNvbnRyb2xsZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55Pikge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW07XG5cbiAgV3JpdGFibGVTdHJlYW1NYXJrQ2xvc2VSZXF1ZXN0SW5GbGlnaHQoc3RyZWFtKTtcblxuICBEZXF1ZXVlVmFsdWUoY29udHJvbGxlcik7XG4gIGFzc2VydChjb250cm9sbGVyLl9xdWV1ZS5sZW5ndGggPT09IDApO1xuXG4gIGNvbnN0IHNpbmtDbG9zZVByb21pc2UgPSBjb250cm9sbGVyLl9jbG9zZUFsZ29yaXRobSgpO1xuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuICB1cG9uUHJvbWlzZShcbiAgICBzaW5rQ2xvc2VQcm9taXNlLFxuICAgICgpID0+IHtcbiAgICAgIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRDbG9zZShzdHJlYW0pO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByZWFzb24gPT4ge1xuICAgICAgV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodENsb3NlV2l0aEVycm9yKHN0cmVhbSwgcmVhc29uKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclByb2Nlc3NXcml0ZTxXPihjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFc+LCBjaHVuazogVykge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkV3JpdGFibGVTdHJlYW07XG5cbiAgV3JpdGFibGVTdHJlYW1NYXJrRmlyc3RXcml0ZVJlcXVlc3RJbkZsaWdodChzdHJlYW0pO1xuXG4gIGNvbnN0IHNpbmtXcml0ZVByb21pc2UgPSBjb250cm9sbGVyLl93cml0ZUFsZ29yaXRobShjaHVuayk7XG4gIHVwb25Qcm9taXNlKFxuICAgIHNpbmtXcml0ZVByb21pc2UsXG4gICAgKCkgPT4ge1xuICAgICAgV3JpdGFibGVTdHJlYW1GaW5pc2hJbkZsaWdodFdyaXRlKHN0cmVhbSk7XG5cbiAgICAgIGNvbnN0IHN0YXRlID0gc3RyZWFtLl9zdGF0ZTtcbiAgICAgIGFzc2VydChzdGF0ZSA9PT0gJ3dyaXRhYmxlJyB8fCBzdGF0ZSA9PT0gJ2Vycm9yaW5nJyk7XG5cbiAgICAgIERlcXVldWVWYWx1ZShjb250cm9sbGVyKTtcblxuICAgICAgaWYgKCFXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChzdHJlYW0pICYmIHN0YXRlID09PSAnd3JpdGFibGUnKSB7XG4gICAgICAgIGNvbnN0IGJhY2twcmVzc3VyZSA9IFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXRCYWNrcHJlc3N1cmUoY29udHJvbGxlcik7XG4gICAgICAgIFdyaXRhYmxlU3RyZWFtVXBkYXRlQmFja3ByZXNzdXJlKHN0cmVhbSwgYmFja3ByZXNzdXJlKTtcbiAgICAgIH1cblxuICAgICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckFkdmFuY2VRdWV1ZUlmTmVlZGVkKGNvbnRyb2xsZXIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICByZWFzb24gPT4ge1xuICAgICAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICd3cml0YWJsZScpIHtcbiAgICAgICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyKTtcbiAgICAgIH1cbiAgICAgIFdyaXRhYmxlU3RyZWFtRmluaXNoSW5GbGlnaHRXcml0ZVdpdGhFcnJvcihzdHJlYW0sIHJlYXNvbik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXRCYWNrcHJlc3N1cmUoY29udHJvbGxlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KTogYm9vbGVhbiB7XG4gIGNvbnN0IGRlc2lyZWRTaXplID0gV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKGNvbnRyb2xsZXIpO1xuICByZXR1cm4gZGVzaXJlZFNpemUgPD0gMDtcbn1cblxuLy8gQSBjbGllbnQgb2YgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlciBtYXkgdXNlIHRoZXNlIGZ1bmN0aW9ucyBkaXJlY3RseSB0byBieXBhc3Mgc3RhdGUgY2hlY2suXG5cbmZ1bmN0aW9uIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4sIGVycm9yOiBhbnkpIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFdyaXRhYmxlU3RyZWFtO1xuXG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAnd3JpdGFibGUnKTtcblxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuICBXcml0YWJsZVN0cmVhbVN0YXJ0RXJyb3Jpbmcoc3RyZWFtLCBlcnJvcik7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbS5cblxuZnVuY3Rpb24gc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihgV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFdyaXRhYmxlU3RyZWFtYCk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLlxuXG5mdW5jdGlvbiBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJgKTtcbn1cblxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLlxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyQnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcbiAgICBgV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJgKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckxvY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCAnICsgbmFtZSArICcgYSBzdHJlYW0gdXNpbmcgYSByZWxlYXNlZCB3cml0ZXInKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKSB7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZSA9IG5ld1Byb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVqZWN0ID0gcmVqZWN0O1xuICAgIHdyaXRlci5fY2xvc2VkUHJvbWlzZVN0YXRlID0gJ3BlbmRpbmcnO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplKHdyaXRlcik7XG4gIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVqZWN0KHdyaXRlciwgcmVhc29uKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VJbml0aWFsaXplQXNSZXNvbHZlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemUod3JpdGVyKTtcbiAgZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZXNvbHZlKHdyaXRlcik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJDbG9zZWRQcm9taXNlUmVqZWN0KHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCByZWFzb246IGFueSkge1xuICBpZiAod3JpdGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFzc2VydCh3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9PT0gJ3BlbmRpbmcnKTtcblxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlKHdyaXRlci5fY2xvc2VkUHJvbWlzZSk7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QocmVhc29uKTtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fY2xvc2VkUHJvbWlzZVN0YXRlID0gJ3JlamVjdGVkJztcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZXNldFRvUmVqZWN0ZWQod3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXIsIHJlYXNvbjogYW55KSB7XG4gIGFzc2VydCh3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHdyaXRlci5fY2xvc2VkUHJvbWlzZV9yZWplY3QgPT09IHVuZGVmaW5lZCk7XG4gIGFzc2VydCh3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSAhPT0gJ3BlbmRpbmcnKTtcblxuICBkZWZhdWx0V3JpdGVyQ2xvc2VkUHJvbWlzZUluaXRpYWxpemVBc1JlamVjdGVkKHdyaXRlciwgcmVhc29uKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFdyaXRlckNsb3NlZFByb21pc2VSZXNvbHZlKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyKSB7XG4gIGlmICh3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFzc2VydCh3cml0ZXIuX2Nsb3NlZFByb21pc2VTdGF0ZSA9PT0gJ3BlbmRpbmcnKTtcblxuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSh1bmRlZmluZWQpO1xuICB3cml0ZXIuX2Nsb3NlZFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9jbG9zZWRQcm9taXNlU3RhdGUgPSAncmVzb2x2ZWQnO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZSA9IG5ld1Byb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdCA9IHJlamVjdDtcbiAgfSk7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlU3RhdGUgPSAncGVuZGluZyc7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplQXNSZWplY3RlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlciwgcmVhc29uOiBhbnkpIHtcbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZUluaXRpYWxpemUod3JpdGVyKTtcbiAgZGVmYXVsdFdyaXRlclJlYWR5UHJvbWlzZVJlamVjdCh3cml0ZXIsIHJlYXNvbik7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VJbml0aWFsaXplQXNSZXNvbHZlZCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXIpO1xuICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzb2x2ZSh3cml0ZXIpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVqZWN0KHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCByZWFzb246IGFueSkge1xuICBpZiAod3JpdGVyLl9yZWFkeVByb21pc2VfcmVqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlKHdyaXRlci5fcmVhZHlQcm9taXNlKTtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVqZWN0KHJlYXNvbik7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdCA9IHVuZGVmaW5lZDtcbiAgd3JpdGVyLl9yZWFkeVByb21pc2VTdGF0ZSA9ICdyZWplY3RlZCc7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXcml0ZXJSZWFkeVByb21pc2VSZXNldCh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICBhc3NlcnQod3JpdGVyLl9yZWFkeVByb21pc2VfcmVzb2x2ZSA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKTtcblxuICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZSh3cml0ZXIpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzZXRUb1JlamVjdGVkKHdyaXRlcjogV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyLCByZWFzb246IGFueSkge1xuICBhc3NlcnQod3JpdGVyLl9yZWFkeVByb21pc2VfcmVzb2x2ZSA9PT0gdW5kZWZpbmVkKTtcbiAgYXNzZXJ0KHdyaXRlci5fcmVhZHlQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKTtcblxuICBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlSW5pdGlhbGl6ZUFzUmVqZWN0ZWQod3JpdGVyLCByZWFzb24pO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V3JpdGVyUmVhZHlQcm9taXNlUmVzb2x2ZSh3cml0ZXI6IFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcikge1xuICBpZiAod3JpdGVyLl9yZWFkeVByb21pc2VfcmVzb2x2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd3JpdGVyLl9yZWFkeVByb21pc2VfcmVzb2x2ZSh1bmRlZmluZWQpO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZXNvbHZlID0gdW5kZWZpbmVkO1xuICB3cml0ZXIuX3JlYWR5UHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG4gIHdyaXRlci5fcmVhZHlQcm9taXNlU3RhdGUgPSAnZnVsZmlsbGVkJztcbn1cbiIsICIvLy8gPHJlZmVyZW5jZSBsaWI9XCJkb21cIiAvPlxuXG5mdW5jdGlvbiBnZXRHbG9iYWxzKCk6IHR5cGVvZiBnbG9iYWxUaGlzIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWxUaGlzO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBzZWxmO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGdsb2JhbDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgY29uc3QgZ2xvYmFscyA9IGdldEdsb2JhbHMoKTtcbiIsICIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cIm5vZGVcIiAvPlxuaW1wb3J0IHsgZ2xvYmFscyB9IGZyb20gJy4uL2dsb2JhbHMnO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lIH0gZnJvbSAnLi4vbGliL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5cbmludGVyZmFjZSBET01FeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XG4gIG5hbWU6IHN0cmluZztcbiAgbWVzc2FnZTogc3RyaW5nO1xufVxuXG50eXBlIERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yID0gbmV3IChtZXNzYWdlPzogc3RyaW5nLCBuYW1lPzogc3RyaW5nKSA9PiBET01FeGNlcHRpb247XG5cbmZ1bmN0aW9uIGlzRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IoY3RvcjogdW5rbm93bik6IGN0b3IgaXMgRE9NRXhjZXB0aW9uQ29uc3RydWN0b3Ige1xuICBpZiAoISh0eXBlb2YgY3RvciA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgY3RvciA9PT0gJ29iamVjdCcpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICgoY3RvciBhcyBET01FeGNlcHRpb25Db25zdHJ1Y3RvcikubmFtZSAhPT0gJ0RPTUV4Y2VwdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdHJ5IHtcbiAgICBuZXcgKGN0b3IgYXMgRE9NRXhjZXB0aW9uQ29uc3RydWN0b3IpKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFN1cHBvcnQ6XG4gKiAtIFdlYiBicm93c2Vyc1xuICogLSBOb2RlIDE4IGFuZCBoaWdoZXIgKGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9jb21taXQvZTRiMWZiNWU2NDIyYzFmZjE1MTIzNGJiOWRlNzkyZDQ1ZGQ4OGQ4NylcbiAqL1xuZnVuY3Rpb24gZ2V0RnJvbUdsb2JhbCgpOiBET01FeGNlcHRpb25Db25zdHJ1Y3RvciB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGN0b3IgPSBnbG9iYWxzPy5ET01FeGNlcHRpb247XG4gIHJldHVybiBpc0RPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yKGN0b3IpID8gY3RvciA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBTdXBwb3J0OlxuICogLSBBbGwgcGxhdGZvcm1zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVBvbHlmaWxsKCk6IERPTUV4Y2VwdGlvbkNvbnN0cnVjdG9yIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1zaGFkb3dcbiAgY29uc3QgY3RvciA9IGZ1bmN0aW9uIERPTUV4Y2VwdGlvbih0aGlzOiBET01FeGNlcHRpb24sIG1lc3NhZ2U/OiBzdHJpbmcsIG5hbWU/OiBzdHJpbmcpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8ICcnO1xuICAgIHRoaXMubmFtZSA9IG5hbWUgfHwgJ0Vycm9yJztcbiAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICAgIH1cbiAgfSBhcyBhbnk7XG4gIHNldEZ1bmN0aW9uTmFtZShjdG9yLCAnRE9NRXhjZXB0aW9uJyk7XG4gIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3Rvci5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIHsgdmFsdWU6IGN0b3IsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSk7XG4gIHJldHVybiBjdG9yO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlZGVjbGFyZVxuY29uc3QgRE9NRXhjZXB0aW9uOiBET01FeGNlcHRpb25Db25zdHJ1Y3RvciA9IGdldEZyb21HbG9iYWwoKSB8fCBjcmVhdGVQb2x5ZmlsbCgpO1xuXG5leHBvcnQgeyBET01FeGNlcHRpb24gfTtcbiIsICJpbXBvcnQgeyBJc1JlYWRhYmxlU3RyZWFtLCBJc1JlYWRhYmxlU3RyZWFtTG9ja2VkLCBSZWFkYWJsZVN0cmVhbSwgUmVhZGFibGVTdHJlYW1DYW5jZWwgfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlciwgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZCB9IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZSB9IGZyb20gJy4vZ2VuZXJpYy1yZWFkZXInO1xuaW1wb3J0IHtcbiAgQWNxdWlyZVdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcixcbiAgSXNXcml0YWJsZVN0cmVhbSxcbiAgSXNXcml0YWJsZVN0cmVhbUxvY2tlZCxcbiAgV3JpdGFibGVTdHJlYW0sXG4gIFdyaXRhYmxlU3RyZWFtQWJvcnQsXG4gIFdyaXRhYmxlU3RyZWFtQ2xvc2VRdWV1ZWRPckluRmxpZ2h0LFxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJDbG9zZVdpdGhFcnJvclByb3BhZ2F0aW9uLFxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJSZWxlYXNlLFxuICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJXcml0ZVxufSBmcm9tICcuLi93cml0YWJsZS1zdHJlYW0nO1xuaW1wb3J0IGFzc2VydCBmcm9tICcuLi8uLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQge1xuICBuZXdQcm9taXNlLFxuICBQZXJmb3JtUHJvbWlzZVRoZW4sXG4gIHByb21pc2VSZXNvbHZlZFdpdGgsXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUsXG4gIHVwb25GdWxmaWxsbWVudCxcbiAgdXBvblByb21pc2UsXG4gIHVwb25SZWplY3Rpb25cbn0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IHR5cGUgQWJvcnRTaWduYWwsIGlzQWJvcnRTaWduYWwgfSBmcm9tICcuLi9hYm9ydC1zaWduYWwnO1xuaW1wb3J0IHsgRE9NRXhjZXB0aW9uIH0gZnJvbSAnLi4vLi4vc3R1Yi9kb20tZXhjZXB0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtUGlwZVRvPFQ+KHNvdXJjZTogUmVhZGFibGVTdHJlYW08VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzdDogV3JpdGFibGVTdHJlYW08VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudENsb3NlOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnRBYm9ydDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50Q2FuY2VsOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25hbDogQWJvcnRTaWduYWwgfCB1bmRlZmluZWQpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICBhc3NlcnQoSXNSZWFkYWJsZVN0cmVhbShzb3VyY2UpKTtcbiAgYXNzZXJ0KElzV3JpdGFibGVTdHJlYW0oZGVzdCkpO1xuICBhc3NlcnQodHlwZW9mIHByZXZlbnRDbG9zZSA9PT0gJ2Jvb2xlYW4nKTtcbiAgYXNzZXJ0KHR5cGVvZiBwcmV2ZW50QWJvcnQgPT09ICdib29sZWFuJyk7XG4gIGFzc2VydCh0eXBlb2YgcHJldmVudENhbmNlbCA9PT0gJ2Jvb2xlYW4nKTtcbiAgYXNzZXJ0KHNpZ25hbCA9PT0gdW5kZWZpbmVkIHx8IGlzQWJvcnRTaWduYWwoc2lnbmFsKSk7XG4gIGFzc2VydCghSXNSZWFkYWJsZVN0cmVhbUxvY2tlZChzb3VyY2UpKTtcbiAgYXNzZXJ0KCFJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKGRlc3QpKTtcblxuICBjb25zdCByZWFkZXIgPSBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFQ+KHNvdXJjZSk7XG4gIGNvbnN0IHdyaXRlciA9IEFjcXVpcmVXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8VD4oZGVzdCk7XG5cbiAgc291cmNlLl9kaXN0dXJiZWQgPSB0cnVlO1xuXG4gIGxldCBzaHV0dGluZ0Rvd24gPSBmYWxzZTtcblxuICAvLyBUaGlzIGlzIHVzZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgc3BlYydzIHJlcXVpcmVtZW50IHRoYXQgd2Ugd2FpdCBmb3Igb25nb2luZyB3cml0ZXMgZHVyaW5nIHNodXRkb3duLlxuICBsZXQgY3VycmVudFdyaXRlID0gcHJvbWlzZVJlc29sdmVkV2l0aDx2b2lkPih1bmRlZmluZWQpO1xuXG4gIHJldHVybiBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgYWJvcnRBbGdvcml0aG06ICgpID0+IHZvaWQ7XG4gICAgaWYgKHNpZ25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhYm9ydEFsZ29yaXRobSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBzaWduYWwucmVhc29uICE9PSB1bmRlZmluZWQgPyBzaWduYWwucmVhc29uIDogbmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJyk7XG4gICAgICAgIGNvbnN0IGFjdGlvbnM6IEFycmF5PCgpID0+IFByb21pc2U8dm9pZD4+ID0gW107XG4gICAgICAgIGlmICghcHJldmVudEFib3J0KSB7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIGlmIChkZXN0Ll9zdGF0ZSA9PT0gJ3dyaXRhYmxlJykge1xuICAgICAgICAgICAgICByZXR1cm4gV3JpdGFibGVTdHJlYW1BYm9ydChkZXN0LCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldmVudENhbmNlbCkge1xuICAgICAgICAgIGFjdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoc291cmNlLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJykge1xuICAgICAgICAgICAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1DYW5jZWwoc291cmNlLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNodXRkb3duV2l0aEFjdGlvbigoKSA9PiBQcm9taXNlLmFsbChhY3Rpb25zLm1hcChhY3Rpb24gPT4gYWN0aW9uKCkpKSwgdHJ1ZSwgZXJyb3IpO1xuICAgICAgfTtcblxuICAgICAgaWYgKHNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICAgIGFib3J0QWxnb3JpdGhtKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbGdvcml0aG0pO1xuICAgIH1cblxuICAgIC8vIFVzaW5nIHJlYWRlciBhbmQgd3JpdGVyLCByZWFkIGFsbCBjaHVua3MgZnJvbSB0aGlzIGFuZCB3cml0ZSB0aGVtIHRvIGRlc3RcbiAgICAvLyAtIEJhY2twcmVzc3VyZSBtdXN0IGJlIGVuZm9yY2VkXG4gICAgLy8gLSBTaHV0ZG93biBtdXN0IHN0b3AgYWxsIGFjdGl2aXR5XG4gICAgZnVuY3Rpb24gcGlwZUxvb3AoKSB7XG4gICAgICByZXR1cm4gbmV3UHJvbWlzZTx2b2lkPigocmVzb2x2ZUxvb3AsIHJlamVjdExvb3ApID0+IHtcbiAgICAgICAgZnVuY3Rpb24gbmV4dChkb25lOiBib29sZWFuKSB7XG4gICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIHJlc29sdmVMb29wKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFVzZSBgUGVyZm9ybVByb21pc2VUaGVuYCBpbnN0ZWFkIG9mIGB1cG9uUHJvbWlzZWAgdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIGFkZGluZyB1bm5lY2Vzc2FyeSBgLmNhdGNoKHJldGhyb3dBc3NlcnRpb25FcnJvclJlamVjdGlvbilgIGhhbmRsZXJzXG4gICAgICAgICAgICBQZXJmb3JtUHJvbWlzZVRoZW4ocGlwZVN0ZXAoKSwgbmV4dCwgcmVqZWN0TG9vcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV4dChmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwaXBlU3RlcCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgIGlmIChzaHV0dGluZ0Rvd24pIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQZXJmb3JtUHJvbWlzZVRoZW4od3JpdGVyLl9yZWFkeVByb21pc2UsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ld1Byb21pc2U8Ym9vbGVhbj4oKHJlc29sdmVSZWFkLCByZWplY3RSZWFkKSA9PiB7XG4gICAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZChcbiAgICAgICAgICAgIHJlYWRlcixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50V3JpdGUgPSBQZXJmb3JtUHJvbWlzZVRoZW4oV3JpdGFibGVTdHJlYW1EZWZhdWx0V3JpdGVyV3JpdGUod3JpdGVyLCBjaHVuayksIHVuZGVmaW5lZCwgbm9vcCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZVJlYWQoZmFsc2UpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBfY2xvc2VTdGVwczogKCkgPT4gcmVzb2x2ZVJlYWQodHJ1ZSksXG4gICAgICAgICAgICAgIF9lcnJvclN0ZXBzOiByZWplY3RSZWFkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBFcnJvcnMgbXVzdCBiZSBwcm9wYWdhdGVkIGZvcndhcmRcbiAgICBpc09yQmVjb21lc0Vycm9yZWQoc291cmNlLCByZWFkZXIuX2Nsb3NlZFByb21pc2UsIHN0b3JlZEVycm9yID0+IHtcbiAgICAgIGlmICghcHJldmVudEFib3J0KSB7XG4gICAgICAgIHNodXRkb3duV2l0aEFjdGlvbigoKSA9PiBXcml0YWJsZVN0cmVhbUFib3J0KGRlc3QsIHN0b3JlZEVycm9yKSwgdHJ1ZSwgc3RvcmVkRXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2h1dGRvd24odHJ1ZSwgc3RvcmVkRXJyb3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICAvLyBFcnJvcnMgbXVzdCBiZSBwcm9wYWdhdGVkIGJhY2t3YXJkXG4gICAgaXNPckJlY29tZXNFcnJvcmVkKGRlc3QsIHdyaXRlci5fY2xvc2VkUHJvbWlzZSwgc3RvcmVkRXJyb3IgPT4ge1xuICAgICAgaWYgKCFwcmV2ZW50Q2FuY2VsKSB7XG4gICAgICAgIHNodXRkb3duV2l0aEFjdGlvbigoKSA9PiBSZWFkYWJsZVN0cmVhbUNhbmNlbChzb3VyY2UsIHN0b3JlZEVycm9yKSwgdHJ1ZSwgc3RvcmVkRXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2h1dGRvd24odHJ1ZSwgc3RvcmVkRXJyb3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICAvLyBDbG9zaW5nIG11c3QgYmUgcHJvcGFnYXRlZCBmb3J3YXJkXG4gICAgaXNPckJlY29tZXNDbG9zZWQoc291cmNlLCByZWFkZXIuX2Nsb3NlZFByb21pc2UsICgpID0+IHtcbiAgICAgIGlmICghcHJldmVudENsb3NlKSB7XG4gICAgICAgIHNodXRkb3duV2l0aEFjdGlvbigoKSA9PiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJDbG9zZVdpdGhFcnJvclByb3BhZ2F0aW9uKHdyaXRlcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2h1dGRvd24oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgLy8gQ2xvc2luZyBtdXN0IGJlIHByb3BhZ2F0ZWQgYmFja3dhcmRcbiAgICBpZiAoV3JpdGFibGVTdHJlYW1DbG9zZVF1ZXVlZE9ySW5GbGlnaHQoZGVzdCkgfHwgZGVzdC5fc3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgICBjb25zdCBkZXN0Q2xvc2VkID0gbmV3IFR5cGVFcnJvcigndGhlIGRlc3RpbmF0aW9uIHdyaXRhYmxlIHN0cmVhbSBjbG9zZWQgYmVmb3JlIGFsbCBkYXRhIGNvdWxkIGJlIHBpcGVkIHRvIGl0Jyk7XG5cbiAgICAgIGlmICghcHJldmVudENhbmNlbCkge1xuICAgICAgICBzaHV0ZG93bldpdGhBY3Rpb24oKCkgPT4gUmVhZGFibGVTdHJlYW1DYW5jZWwoc291cmNlLCBkZXN0Q2xvc2VkKSwgdHJ1ZSwgZGVzdENsb3NlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaHV0ZG93bih0cnVlLCBkZXN0Q2xvc2VkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlKHBpcGVMb29wKCkpO1xuXG4gICAgZnVuY3Rpb24gd2FpdEZvcldyaXRlc1RvRmluaXNoKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgLy8gQW5vdGhlciB3cml0ZSBtYXkgaGF2ZSBzdGFydGVkIHdoaWxlIHdlIHdlcmUgd2FpdGluZyBvbiB0aGlzIGN1cnJlbnRXcml0ZSwgc28gd2UgaGF2ZSB0byBiZSBzdXJlIHRvIHdhaXRcbiAgICAgIC8vIGZvciB0aGF0IHRvby5cbiAgICAgIGNvbnN0IG9sZEN1cnJlbnRXcml0ZSA9IGN1cnJlbnRXcml0ZTtcbiAgICAgIHJldHVybiBQZXJmb3JtUHJvbWlzZVRoZW4oXG4gICAgICAgIGN1cnJlbnRXcml0ZSxcbiAgICAgICAgKCkgPT4gb2xkQ3VycmVudFdyaXRlICE9PSBjdXJyZW50V3JpdGUgPyB3YWl0Rm9yV3JpdGVzVG9GaW5pc2goKSA6IHVuZGVmaW5lZFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09yQmVjb21lc0Vycm9yZWQoc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSB8IFdyaXRhYmxlU3RyZWFtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlOiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IChyZWFzb246IGFueSkgPT4gbnVsbCkge1xuICAgICAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgICAgICBhY3Rpb24oc3RyZWFtLl9zdG9yZWRFcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cG9uUmVqZWN0aW9uKHByb21pc2UsIGFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPckJlY29tZXNDbG9zZWQoc3RyZWFtOiBSZWFkYWJsZVN0cmVhbSB8IFdyaXRhYmxlU3RyZWFtLCBwcm9taXNlOiBQcm9taXNlPHZvaWQ+LCBhY3Rpb246ICgpID0+IG51bGwpIHtcbiAgICAgIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgICAgICBhY3Rpb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVwb25GdWxmaWxsbWVudChwcm9taXNlLCBhY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNodXRkb3duV2l0aEFjdGlvbihhY3Rpb246ICgpID0+IFByb21pc2U8dW5rbm93bj4sIG9yaWdpbmFsSXNFcnJvcj86IGJvb2xlYW4sIG9yaWdpbmFsRXJyb3I/OiBhbnkpIHtcbiAgICAgIGlmIChzaHV0dGluZ0Rvd24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2h1dHRpbmdEb3duID0gdHJ1ZTtcblxuICAgICAgaWYgKGRlc3QuX3N0YXRlID09PSAnd3JpdGFibGUnICYmICFXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChkZXN0KSkge1xuICAgICAgICB1cG9uRnVsZmlsbG1lbnQod2FpdEZvcldyaXRlc1RvRmluaXNoKCksIGRvVGhlUmVzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb1RoZVJlc3QoKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZG9UaGVSZXN0KCk6IG51bGwge1xuICAgICAgICB1cG9uUHJvbWlzZShcbiAgICAgICAgICBhY3Rpb24oKSxcbiAgICAgICAgICAoKSA9PiBmaW5hbGl6ZShvcmlnaW5hbElzRXJyb3IsIG9yaWdpbmFsRXJyb3IpLFxuICAgICAgICAgIG5ld0Vycm9yID0+IGZpbmFsaXplKHRydWUsIG5ld0Vycm9yKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaHV0ZG93bihpc0Vycm9yPzogYm9vbGVhbiwgZXJyb3I/OiBhbnkpIHtcbiAgICAgIGlmIChzaHV0dGluZ0Rvd24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2h1dHRpbmdEb3duID0gdHJ1ZTtcblxuICAgICAgaWYgKGRlc3QuX3N0YXRlID09PSAnd3JpdGFibGUnICYmICFXcml0YWJsZVN0cmVhbUNsb3NlUXVldWVkT3JJbkZsaWdodChkZXN0KSkge1xuICAgICAgICB1cG9uRnVsZmlsbG1lbnQod2FpdEZvcldyaXRlc1RvRmluaXNoKCksICgpID0+IGZpbmFsaXplKGlzRXJyb3IsIGVycm9yKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaW5hbGl6ZShpc0Vycm9yLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluYWxpemUoaXNFcnJvcj86IGJvb2xlYW4sIGVycm9yPzogYW55KTogbnVsbCB7XG4gICAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXJSZWxlYXNlKHdyaXRlcik7XG4gICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG5cbiAgICAgIGlmIChzaWduYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFsZ29yaXRobSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNFcnJvcikge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0pO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrIH0gZnJvbSAnLi4vcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IERlcXVldWVWYWx1ZSwgRW5xdWV1ZVZhbHVlV2l0aFNpemUsIHR5cGUgUXVldWVQYWlyLCBSZXNldFF1ZXVlIH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL3F1ZXVlLXdpdGgtc2l6ZXMnO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1BZGRSZWFkUmVxdWVzdCxcbiAgUmVhZGFibGVTdHJlYW1GdWxmaWxsUmVhZFJlcXVlc3QsXG4gIFJlYWRhYmxlU3RyZWFtR2V0TnVtUmVhZFJlcXVlc3RzLFxuICB0eXBlIFJlYWRSZXF1ZXN0XG59IGZyb20gJy4vZGVmYXVsdC1yZWFkZXInO1xuaW1wb3J0IHsgU2ltcGxlUXVldWUgfSBmcm9tICcuLi9zaW1wbGUtcXVldWUnO1xuaW1wb3J0IHsgSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCwgUmVhZGFibGVTdHJlYW0sIFJlYWRhYmxlU3RyZWFtQ2xvc2UsIFJlYWRhYmxlU3RyZWFtRXJyb3IgfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHR5cGUgeyBWYWxpZGF0ZWRVbmRlcmx5aW5nU291cmNlIH0gZnJvbSAnLi91bmRlcmx5aW5nLXNvdXJjZSc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBDYW5jZWxTdGVwcywgUHVsbFN0ZXBzLCBSZWxlYXNlU3RlcHMgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvaW50ZXJuYWwtbWV0aG9kcyc7XG5pbXBvcnQgeyBwcm9taXNlUmVzb2x2ZWRXaXRoLCB1cG9uUHJvbWlzZSB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcblxuLyoqXG4gKiBBbGxvd3MgY29udHJvbCBvZiBhIHtAbGluayBSZWFkYWJsZVN0cmVhbSB8IHJlYWRhYmxlIHN0cmVhbX0ncyBzdGF0ZSBhbmQgaW50ZXJuYWwgcXVldWUuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbnRyb2xsZWRSZWFkYWJsZVN0cmVhbSE6IFJlYWRhYmxlU3RyZWFtPFI+O1xuICAvKiogQGludGVybmFsICovXG4gIF9xdWV1ZSE6IFNpbXBsZVF1ZXVlPFF1ZXVlUGFpcjxSPj47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3F1ZXVlVG90YWxTaXplITogbnVtYmVyO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdGFydGVkITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvc2VSZXF1ZXN0ZWQhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9wdWxsQWdhaW4hOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9wdWxsaW5nICE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobSE6IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxSPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RyYXRlZ3lIV00hOiBudW1iZXI7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3B1bGxBbGdvcml0aG0hOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAvKiogQGludGVybmFsICovXG4gIF9jYW5jZWxBbGdvcml0aG0hOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbGxlZ2FsIGNvbnN0cnVjdG9yJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVzaXJlZCBzaXplIHRvIGZpbGwgdGhlIGNvbnRyb2xsZWQgc3RyZWFtJ3MgaW50ZXJuYWwgcXVldWUuIEl0IGNhbiBiZSBuZWdhdGl2ZSwgaWYgdGhlIHF1ZXVlIGlzXG4gICAqIG92ZXItZnVsbC4gQW4gdW5kZXJseWluZyBzb3VyY2Ugb3VnaHQgdG8gdXNlIHRoaXMgaW5mb3JtYXRpb24gdG8gZGV0ZXJtaW5lIHdoZW4gYW5kIGhvdyB0byBhcHBseSBiYWNrcHJlc3N1cmUuXG4gICAqL1xuICBnZXQgZGVzaXJlZFNpemUoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZGVzaXJlZFNpemUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgY29udHJvbGxlZCByZWFkYWJsZSBzdHJlYW0uIENvbnN1bWVycyB3aWxsIHN0aWxsIGJlIGFibGUgdG8gcmVhZCBhbnkgcHJldmlvdXNseS1lbnF1ZXVlZCBjaHVua3MgZnJvbVxuICAgKiB0aGUgc3RyZWFtLCBidXQgb25jZSB0aG9zZSBhcmUgcmVhZCwgdGhlIHN0cmVhbSB3aWxsIGJlY29tZSBjbG9zZWQuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdjbG9zZScpO1xuICAgIH1cblxuICAgIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKHRoaXMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgc3RyZWFtIGlzIG5vdCBpbiBhIHN0YXRlIHRoYXQgcGVybWl0cyBjbG9zZScpO1xuICAgIH1cblxuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnF1ZXVlcyB0aGUgZ2l2ZW4gY2h1bmsgYGNodW5rYCBpbiB0aGUgY29udHJvbGxlZCByZWFkYWJsZSBzdHJlYW0uXG4gICAqL1xuICBlbnF1ZXVlKGNodW5rOiBSKTogdm9pZDtcbiAgZW5xdWV1ZShjaHVuazogUiA9IHVuZGVmaW5lZCEpOiB2b2lkIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdlbnF1ZXVlJyk7XG4gICAgfVxuXG4gICAgaWYgKCFSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FuQ2xvc2VPckVucXVldWUodGhpcykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBzdHJlYW0gaXMgbm90IGluIGEgc3RhdGUgdGhhdCBwZXJtaXRzIGVucXVldWUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUodGhpcywgY2h1bmspO1xuICB9XG5cbiAgLyoqXG4gICAqIEVycm9ycyB0aGUgY29udHJvbGxlZCByZWFkYWJsZSBzdHJlYW0sIG1ha2luZyBhbGwgZnV0dXJlIGludGVyYWN0aW9ucyB3aXRoIGl0IGZhaWwgd2l0aCB0aGUgZ2l2ZW4gZXJyb3IgYGVgLlxuICAgKi9cbiAgZXJyb3IoZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgaWYgKCFJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZXJyb3InKTtcbiAgICB9XG5cbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IodGhpcywgZSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtDYW5jZWxTdGVwc10ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBSZXNldFF1ZXVlKHRoaXMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2NhbmNlbEFsZ29yaXRobShyZWFzb24pO1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXModGhpcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgW1B1bGxTdGVwc10ocmVhZFJlcXVlc3Q6IFJlYWRSZXF1ZXN0PFI+KTogdm9pZCB7XG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtO1xuXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNodW5rID0gRGVxdWV1ZVZhbHVlKHRoaXMpO1xuXG4gICAgICBpZiAodGhpcy5fY2xvc2VSZXF1ZXN0ZWQgJiYgdGhpcy5fcXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXModGhpcyk7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtQ2xvc2Uoc3RyZWFtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDYWxsUHVsbElmTmVlZGVkKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICByZWFkUmVxdWVzdC5fY2h1bmtTdGVwcyhjaHVuayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFJlYWRhYmxlU3RyZWFtQWRkUmVhZFJlcXVlc3Qoc3RyZWFtLCByZWFkUmVxdWVzdCk7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIFtSZWxlYXNlU3RlcHNdKCk6IHZvaWQge1xuICAgIC8vIERvIG5vdGhpbmcuXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUsIHtcbiAgY2xvc2U6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBlbnF1ZXVlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZXJyb3I6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBkZXNpcmVkU2l6ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLmNsb3NlLCAnY2xvc2UnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS5lbnF1ZXVlLCAnZW5xdWV1ZScpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLmVycm9yLCAnZXJyb3InKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywge1xuICAgIHZhbHVlOiAnUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcicsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlci5cblxuZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFIgPSBhbnk+KHg6IGFueSk6IHggaXMgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPiB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19jb250cm9sbGVkUmVhZGFibGVTdHJlYW0nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjtcbn1cblxuZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KTogdm9pZCB7XG4gIGNvbnN0IHNob3VsZFB1bGwgPSBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyU2hvdWxkQ2FsbFB1bGwoY29udHJvbGxlcik7XG4gIGlmICghc2hvdWxkUHVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjb250cm9sbGVyLl9wdWxsaW5nKSB7XG4gICAgY29udHJvbGxlci5fcHVsbEFnYWluID0gdHJ1ZTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhc3NlcnQoIWNvbnRyb2xsZXIuX3B1bGxBZ2Fpbik7XG5cbiAgY29udHJvbGxlci5fcHVsbGluZyA9IHRydWU7XG5cbiAgY29uc3QgcHVsbFByb21pc2UgPSBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtKCk7XG4gIHVwb25Qcm9taXNlKFxuICAgIHB1bGxQcm9taXNlLFxuICAgICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuX3B1bGxpbmcgPSBmYWxzZTtcblxuICAgICAgaWYgKGNvbnRyb2xsZXIuX3B1bGxBZ2Fpbikge1xuICAgICAgICBjb250cm9sbGVyLl9wdWxsQWdhaW4gPSBmYWxzZTtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZSA9PiB7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJTaG91bGRDYWxsUHVsbChjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pOiBib29sZWFuIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtO1xuXG4gIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKGNvbnRyb2xsZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFjb250cm9sbGVyLl9zdGFydGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSAmJiBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyhzdHJlYW0pID4gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgZGVzaXJlZFNpemUgPSBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUoY29udHJvbGxlcik7XG4gIGFzc2VydChkZXNpcmVkU2l6ZSAhPT0gbnVsbCk7XG4gIGlmIChkZXNpcmVkU2l6ZSEgPiAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbGVhckFsZ29yaXRobXMoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KSB7XG4gIGNvbnRyb2xsZXIuX3B1bGxBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9jYW5jZWxBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0gPSB1bmRlZmluZWQhO1xufVxuXG4vLyBBIGNsaWVudCBvZiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyIG1heSB1c2UgdGhlc2UgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIGJ5cGFzcyBzdGF0ZSBjaGVjay5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4pIHtcbiAgaWYgKCFSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FuQ2xvc2VPckVucXVldWUoY29udHJvbGxlcikpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVTdHJlYW07XG5cbiAgY29udHJvbGxlci5fY2xvc2VSZXF1ZXN0ZWQgPSB0cnVlO1xuXG4gIGlmIChjb250cm9sbGVyLl9xdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuICAgIFJlYWRhYmxlU3RyZWFtQ2xvc2Uoc3RyZWFtKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWU8Uj4oXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4sXG4gIGNodW5rOiBSXG4pOiB2b2lkIHtcbiAgaWYgKCFSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FuQ2xvc2VPckVucXVldWUoY29udHJvbGxlcikpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVTdHJlYW07XG5cbiAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQoc3RyZWFtKSAmJiBSZWFkYWJsZVN0cmVhbUdldE51bVJlYWRSZXF1ZXN0cyhzdHJlYW0pID4gMCkge1xuICAgIFJlYWRhYmxlU3RyZWFtRnVsZmlsbFJlYWRSZXF1ZXN0KHN0cmVhbSwgY2h1bmssIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgY2h1bmtTaXplO1xuICAgIHRyeSB7XG4gICAgICBjaHVua1NpemUgPSBjb250cm9sbGVyLl9zdHJhdGVneVNpemVBbGdvcml0aG0oY2h1bmspO1xuICAgIH0gY2F0Y2ggKGNodW5rU2l6ZUUpIHtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihjb250cm9sbGVyLCBjaHVua1NpemVFKTtcbiAgICAgIHRocm93IGNodW5rU2l6ZUU7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIEVucXVldWVWYWx1ZVdpdGhTaXplKGNvbnRyb2xsZXIsIGNodW5rLCBjaHVua1NpemUpO1xuICAgIH0gY2F0Y2ggKGVucXVldWVFKSB7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgZW5xdWV1ZUUpO1xuICAgICAgdGhyb3cgZW5xdWV1ZUU7XG4gICAgfVxuICB9XG5cbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbGxQdWxsSWZOZWVkZWQoY29udHJvbGxlcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+LCBlOiBhbnkpIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlICE9PSAncmVhZGFibGUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgUmVzZXRRdWV1ZShjb250cm9sbGVyKTtcblxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuICBSZWFkYWJsZVN0cmVhbUVycm9yKHN0cmVhbSwgZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyR2V0RGVzaXJlZFNpemUoXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PlxuKTogbnVtYmVyIHwgbnVsbCB7XG4gIGNvbnN0IHN0YXRlID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChzdGF0ZSA9PT0gJ2Nsb3NlZCcpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiBjb250cm9sbGVyLl9zdHJhdGVneUhXTSAtIGNvbnRyb2xsZXIuX3F1ZXVlVG90YWxTaXplO1xufVxuXG4vLyBUaGlzIGlzIHVzZWQgaW4gdGhlIGltcGxlbWVudGF0aW9uIG9mIFRyYW5zZm9ybVN0cmVhbS5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVySGFzQmFja3ByZXNzdXJlKFxuICBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT5cbik6IGJvb2xlYW4ge1xuICBpZiAoUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlclNob3VsZENhbGxQdWxsKGNvbnRyb2xsZXIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FuQ2xvc2VPckVucXVldWUoXG4gIGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8YW55PlxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHN0YXRlID0gY29udHJvbGxlci5fY29udHJvbGxlZFJlYWRhYmxlU3RyZWFtLl9zdGF0ZTtcblxuICBpZiAoIWNvbnRyb2xsZXIuX2Nsb3NlUmVxdWVzdGVkICYmIHN0YXRlID09PSAncmVhZGFibGUnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVsbEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFI+KSB7XG4gIGFzc2VydChzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciA9PT0gdW5kZWZpbmVkKTtcblxuICBjb250cm9sbGVyLl9jb250cm9sbGVkUmVhZGFibGVTdHJlYW0gPSBzdHJlYW07XG5cbiAgY29udHJvbGxlci5fcXVldWUgPSB1bmRlZmluZWQhO1xuICBjb250cm9sbGVyLl9xdWV1ZVRvdGFsU2l6ZSA9IHVuZGVmaW5lZCE7XG4gIFJlc2V0UXVldWUoY29udHJvbGxlcik7XG5cbiAgY29udHJvbGxlci5fc3RhcnRlZCA9IGZhbHNlO1xuICBjb250cm9sbGVyLl9jbG9zZVJlcXVlc3RlZCA9IGZhbHNlO1xuICBjb250cm9sbGVyLl9wdWxsQWdhaW4gPSBmYWxzZTtcbiAgY29udHJvbGxlci5fcHVsbGluZyA9IGZhbHNlO1xuXG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5U2l6ZUFsZ29yaXRobSA9IHNpemVBbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX3N0cmF0ZWd5SFdNID0gaGlnaFdhdGVyTWFyaztcblxuICBjb250cm9sbGVyLl9wdWxsQWxnb3JpdGhtID0gcHVsbEFsZ29yaXRobTtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gY2FuY2VsQWxnb3JpdGhtO1xuXG4gIHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyID0gY29udHJvbGxlcjtcblxuICBjb25zdCBzdGFydFJlc3VsdCA9IHN0YXJ0QWxnb3JpdGhtKCk7XG4gIHVwb25Qcm9taXNlKFxuICAgIHByb21pc2VSZXNvbHZlZFdpdGgoc3RhcnRSZXN1bHQpLFxuICAgICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuX3N0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICBhc3NlcnQoIWNvbnRyb2xsZXIuX3B1bGxpbmcpO1xuICAgICAgYXNzZXJ0KCFjb250cm9sbGVyLl9wdWxsQWdhaW4pO1xuXG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FsbFB1bGxJZk5lZWRlZChjb250cm9sbGVyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgciA9PiB7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IoY29udHJvbGxlciwgcik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1NvdXJjZTxSPihcbiAgc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPixcbiAgdW5kZXJseWluZ1NvdXJjZTogVmFsaWRhdGVkVW5kZXJseWluZ1NvdXJjZTxSPixcbiAgaGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICBzaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8Uj5cbikge1xuICBjb25zdCBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+ID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgbGV0IHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD47XG4gIGxldCBwdWxsQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD47XG5cbiAgaWYgKHVuZGVybHlpbmdTb3VyY2Uuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgIHN0YXJ0QWxnb3JpdGhtID0gKCkgPT4gdW5kZXJseWluZ1NvdXJjZS5zdGFydCEoY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgc3RhcnRBbGdvcml0aG0gPSAoKSA9PiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHVuZGVybHlpbmdTb3VyY2UucHVsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcHVsbEFsZ29yaXRobSA9ICgpID0+IHVuZGVybHlpbmdTb3VyY2UucHVsbCEoY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgcHVsbEFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuICBpZiAodW5kZXJseWluZ1NvdXJjZS5jYW5jZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGNhbmNlbEFsZ29yaXRobSA9IHJlYXNvbiA9PiB1bmRlcmx5aW5nU291cmNlLmNhbmNlbCEocmVhc29uKTtcbiAgfSBlbHNlIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBTZXRVcFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoXG4gICAgc3RyZWFtLCBjb250cm9sbGVyLCBzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCBoaWdoV2F0ZXJNYXJrLCBzaXplQWxnb3JpdGhtXG4gICk7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLlxuXG5mdW5jdGlvbiBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJgKTtcbn1cbiIsICJpbXBvcnQge1xuICBDcmVhdGVSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gIENyZWF0ZVJlYWRhYmxlU3RyZWFtLFxuICB0eXBlIERlZmF1bHRSZWFkYWJsZVN0cmVhbSxcbiAgSXNSZWFkYWJsZVN0cmVhbSxcbiAgdHlwZSBSZWFkYWJsZUJ5dGVTdHJlYW0sXG4gIFJlYWRhYmxlU3RyZWFtLFxuICBSZWFkYWJsZVN0cmVhbUNhbmNlbCxcbiAgdHlwZSBSZWFkYWJsZVN0cmVhbVJlYWRlclxufSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZSB9IGZyb20gJy4vZ2VuZXJpYy1yZWFkZXInO1xuaW1wb3J0IHtcbiAgQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlclJlYWQsXG4gIHR5cGUgUmVhZFJlcXVlc3Rcbn0gZnJvbSAnLi9kZWZhdWx0LXJlYWRlcic7XG5pbXBvcnQge1xuICBBY3F1aXJlUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLFxuICBJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyUmVhZCxcbiAgdHlwZSBSZWFkSW50b1JlcXVlc3Rcbn0gZnJvbSAnLi9ieW9iLXJlYWRlcic7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJy4uLy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7IG5ld1Byb21pc2UsIHByb21pc2VSZXNvbHZlZFdpdGgsIHF1ZXVlTWljcm90YXNrLCB1cG9uUmVqZWN0aW9uIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yXG59IGZyb20gJy4vZGVmYXVsdC1jb250cm9sbGVyJztcbmltcG9ydCB7XG4gIElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlLFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZSxcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yLFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyR2V0QllPQlJlcXVlc3QsXG4gIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kLFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZFdpdGhOZXdWaWV3XG59IGZyb20gJy4vYnl0ZS1zdHJlYW0tY29udHJvbGxlcic7XG5pbXBvcnQgeyBDcmVhdGVBcnJheUZyb21MaXN0IH0gZnJvbSAnLi4vYWJzdHJhY3Qtb3BzL2VjbWFzY3JpcHQnO1xuaW1wb3J0IHsgQ2xvbmVBc1VpbnQ4QXJyYXkgfSBmcm9tICcuLi9hYnN0cmFjdC1vcHMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgdHlwZSB7IE5vblNoYXJlZCB9IGZyb20gJy4uL2hlbHBlcnMvYXJyYXktYnVmZmVyLXZpZXcnO1xuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1UZWU8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZUZvckJyYW5jaDI6IGJvb2xlYW4pOiBbUmVhZGFibGVTdHJlYW08Uj4sIFJlYWRhYmxlU3RyZWFtPFI+XSB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuICBhc3NlcnQodHlwZW9mIGNsb25lRm9yQnJhbmNoMiA9PT0gJ2Jvb2xlYW4nKTtcbiAgaWYgKElzUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcikpIHtcbiAgICByZXR1cm4gUmVhZGFibGVCeXRlU3RyZWFtVGVlKHN0cmVhbSBhcyB1bmtub3duIGFzIFJlYWRhYmxlQnl0ZVN0cmVhbSkgYXNcbiAgICAgIHVua25vd24gYXMgW1JlYWRhYmxlU3RyZWFtPFI+LCBSZWFkYWJsZVN0cmVhbTxSPl07XG4gIH1cbiAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFRlZShzdHJlYW0sIGNsb25lRm9yQnJhbmNoMik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkYWJsZVN0cmVhbURlZmF1bHRUZWU8Uj4oXG4gIHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sXG4gIGNsb25lRm9yQnJhbmNoMjogYm9vbGVhblxuKTogW0RlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPiwgRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+XSB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuICBhc3NlcnQodHlwZW9mIGNsb25lRm9yQnJhbmNoMiA9PT0gJ2Jvb2xlYW4nKTtcblxuICBjb25zdCByZWFkZXIgPSBBY3F1aXJlUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KHN0cmVhbSk7XG5cbiAgbGV0IHJlYWRpbmcgPSBmYWxzZTtcbiAgbGV0IHJlYWRBZ2FpbiA9IGZhbHNlO1xuICBsZXQgY2FuY2VsZWQxID0gZmFsc2U7XG4gIGxldCBjYW5jZWxlZDIgPSBmYWxzZTtcbiAgbGV0IHJlYXNvbjE6IGFueTtcbiAgbGV0IHJlYXNvbjI6IGFueTtcbiAgbGV0IGJyYW5jaDE6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPjtcbiAgbGV0IGJyYW5jaDI6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxSPjtcblxuICBsZXQgcmVzb2x2ZUNhbmNlbFByb21pc2U6ICh2YWx1ZTogdW5kZWZpbmVkIHwgUHJvbWlzZTx1bmRlZmluZWQ+KSA9PiB2b2lkO1xuICBjb25zdCBjYW5jZWxQcm9taXNlID0gbmV3UHJvbWlzZTx1bmRlZmluZWQ+KHJlc29sdmUgPT4ge1xuICAgIHJlc29sdmVDYW5jZWxQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHVsbEFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAocmVhZGluZykge1xuICAgICAgcmVhZEFnYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgcmVhZGluZyA9IHRydWU7XG5cbiAgICBjb25zdCByZWFkUmVxdWVzdDogUmVhZFJlcXVlc3Q8Uj4gPSB7XG4gICAgICBfY2h1bmtTdGVwczogY2h1bmsgPT4ge1xuICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGRlbGF5ZWQgYSBtaWNyb3Rhc2sgYmVjYXVzZSBpdCB0YWtlcyBhdCBsZWFzdCBhIG1pY3JvdGFzayB0byBkZXRlY3QgZXJyb3JzICh1c2luZ1xuICAgICAgICAvLyByZWFkZXIuX2Nsb3NlZFByb21pc2UgYmVsb3cpLCBhbmQgd2Ugd2FudCBlcnJvcnMgaW4gc3RyZWFtIHRvIGVycm9yIGJvdGggYnJhbmNoZXMgaW1tZWRpYXRlbHkuIFdlIGNhbm5vdCBsZXRcbiAgICAgICAgLy8gc3VjY2Vzc2Z1bCBzeW5jaHJvbm91c2x5LWF2YWlsYWJsZSByZWFkcyBnZXQgYWhlYWQgb2YgYXN5bmNocm9ub3VzbHktYXZhaWxhYmxlIGVycm9ycy5cbiAgICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICAgIHJlYWRBZ2FpbiA9IGZhbHNlO1xuICAgICAgICAgIGNvbnN0IGNodW5rMSA9IGNodW5rO1xuICAgICAgICAgIGNvbnN0IGNodW5rMiA9IGNodW5rO1xuXG4gICAgICAgICAgLy8gVGhlcmUgaXMgbm8gd2F5IHRvIGFjY2VzcyB0aGUgY2xvbmluZyBjb2RlIHJpZ2h0IG5vdyBpbiB0aGUgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIC8vIElmIHdlIGFkZCBvbmUgdGhlbiB3ZSdsbCBuZWVkIGFuIGltcGxlbWVudGF0aW9uIGZvciBzZXJpYWxpemFibGUgb2JqZWN0cy5cbiAgICAgICAgICAvLyBpZiAoIWNhbmNlbGVkMiAmJiBjbG9uZUZvckJyYW5jaDIpIHtcbiAgICAgICAgICAvLyAgIGNodW5rMiA9IFN0cnVjdHVyZWREZXNlcmlhbGl6ZShTdHJ1Y3R1cmVkU2VyaWFsaXplKGNodW5rMikpO1xuICAgICAgICAgIC8vIH1cblxuICAgICAgICAgIGlmICghY2FuY2VsZWQxKSB7XG4gICAgICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZShicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghY2FuY2VsZWQyKSB7XG4gICAgICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZShicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNodW5rMik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgICAgIGlmIChyZWFkQWdhaW4pIHtcbiAgICAgICAgICAgIHB1bGxBbGdvcml0aG0oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIF9jbG9zZVN0ZXBzOiAoKSA9PiB7XG4gICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFjYW5jZWxlZDEpIHtcbiAgICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2UoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNhbmNlbGVkMikge1xuICAgICAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjYW5jZWxlZDEgfHwgIWNhbmNlbGVkMikge1xuICAgICAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfZXJyb3JTdGVwczogKCkgPT4ge1xuICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJSZWFkKHJlYWRlciwgcmVhZFJlcXVlc3QpO1xuXG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbDFBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjYW5jZWxlZDEgPSB0cnVlO1xuICAgIHJlYXNvbjEgPSByZWFzb247XG4gICAgaWYgKGNhbmNlbGVkMikge1xuICAgICAgY29uc3QgY29tcG9zaXRlUmVhc29uID0gQ3JlYXRlQXJyYXlGcm9tTGlzdChbcmVhc29uMSwgcmVhc29uMl0pO1xuICAgICAgY29uc3QgY2FuY2VsUmVzdWx0ID0gUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCBjb21wb3NpdGVSZWFzb24pO1xuICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UoY2FuY2VsUmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbmNlbFByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwyQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY2FuY2VsZWQyID0gdHJ1ZTtcbiAgICByZWFzb24yID0gcmVhc29uO1xuICAgIGlmIChjYW5jZWxlZDEpIHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZVJlYXNvbiA9IENyZWF0ZUFycmF5RnJvbUxpc3QoW3JlYXNvbjEsIHJlYXNvbjJdKTtcbiAgICAgIGNvbnN0IGNhbmNlbFJlc3VsdCA9IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgY29tcG9zaXRlUmVhc29uKTtcbiAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKGNhbmNlbFJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiBjYW5jZWxQcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnRBbGdvcml0aG0oKSB7XG4gICAgLy8gZG8gbm90aGluZ1xuICB9XG5cbiAgYnJhbmNoMSA9IENyZWF0ZVJlYWRhYmxlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWwxQWxnb3JpdGhtKTtcbiAgYnJhbmNoMiA9IENyZWF0ZVJlYWRhYmxlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWwyQWxnb3JpdGhtKTtcblxuICB1cG9uUmVqZWN0aW9uKHJlYWRlci5fY2xvc2VkUHJvbWlzZSwgKHI6IGFueSkgPT4ge1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcihicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHIpO1xuICAgIGlmICghY2FuY2VsZWQxIHx8ICFjYW5jZWxlZDIpIHtcbiAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9KTtcblxuICByZXR1cm4gW2JyYW5jaDEsIGJyYW5jaDJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVCeXRlU3RyZWFtVGVlKHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtKTogW1JlYWRhYmxlQnl0ZVN0cmVhbSwgUmVhZGFibGVCeXRlU3RyZWFtXSB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuICBhc3NlcnQoSXNSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKSk7XG5cbiAgbGV0IHJlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+PiA9IEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIoc3RyZWFtKTtcbiAgbGV0IHJlYWRpbmcgPSBmYWxzZTtcbiAgbGV0IHJlYWRBZ2FpbkZvckJyYW5jaDEgPSBmYWxzZTtcbiAgbGV0IHJlYWRBZ2FpbkZvckJyYW5jaDIgPSBmYWxzZTtcbiAgbGV0IGNhbmNlbGVkMSA9IGZhbHNlO1xuICBsZXQgY2FuY2VsZWQyID0gZmFsc2U7XG4gIGxldCByZWFzb24xOiBhbnk7XG4gIGxldCByZWFzb24yOiBhbnk7XG4gIGxldCBicmFuY2gxOiBSZWFkYWJsZUJ5dGVTdHJlYW07XG4gIGxldCBicmFuY2gyOiBSZWFkYWJsZUJ5dGVTdHJlYW07XG5cbiAgbGV0IHJlc29sdmVDYW5jZWxQcm9taXNlOiAodmFsdWU6IHVuZGVmaW5lZCB8IFByb21pc2U8dW5kZWZpbmVkPikgPT4gdm9pZDtcbiAgY29uc3QgY2FuY2VsUHJvbWlzZSA9IG5ld1Byb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgcmVzb2x2ZUNhbmNlbFByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICBmdW5jdGlvbiBmb3J3YXJkUmVhZGVyRXJyb3IodGhpc1JlYWRlcjogUmVhZGFibGVTdHJlYW1SZWFkZXI8Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+Pikge1xuICAgIHVwb25SZWplY3Rpb24odGhpc1JlYWRlci5fY2xvc2VkUHJvbWlzZSwgciA9PiB7XG4gICAgICBpZiAodGhpc1JlYWRlciAhPT0gcmVhZGVyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgcik7XG4gICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCByKTtcbiAgICAgIGlmICghY2FuY2VsZWQxIHx8ICFjYW5jZWxlZDIpIHtcbiAgICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UodW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVsbFdpdGhEZWZhdWx0UmVhZGVyKCkge1xuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcihyZWFkZXIpKSB7XG4gICAgICBhc3NlcnQocmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzLmxlbmd0aCA9PT0gMCk7XG4gICAgICBSZWFkYWJsZVN0cmVhbVJlYWRlckdlbmVyaWNSZWxlYXNlKHJlYWRlcik7XG5cbiAgICAgIHJlYWRlciA9IEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIoc3RyZWFtKTtcbiAgICAgIGZvcndhcmRSZWFkZXJFcnJvcihyZWFkZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWRSZXF1ZXN0OiBSZWFkUmVxdWVzdDxOb25TaGFyZWQ8VWludDhBcnJheT4+ID0ge1xuICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHtcbiAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWxheWVkIGEgbWljcm90YXNrIGJlY2F1c2UgaXQgdGFrZXMgYXQgbGVhc3QgYSBtaWNyb3Rhc2sgdG8gZGV0ZWN0IGVycm9ycyAodXNpbmdcbiAgICAgICAgLy8gcmVhZGVyLl9jbG9zZWRQcm9taXNlIGJlbG93KSwgYW5kIHdlIHdhbnQgZXJyb3JzIGluIHN0cmVhbSB0byBlcnJvciBib3RoIGJyYW5jaGVzIGltbWVkaWF0ZWx5LiBXZSBjYW5ub3QgbGV0XG4gICAgICAgIC8vIHN1Y2Nlc3NmdWwgc3luY2hyb25vdXNseS1hdmFpbGFibGUgcmVhZHMgZ2V0IGFoZWFkIG9mIGFzeW5jaHJvbm91c2x5LWF2YWlsYWJsZSBlcnJvcnMuXG4gICAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICAgICAgICByZWFkQWdhaW5Gb3JCcmFuY2gxID0gZmFsc2U7XG4gICAgICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMiA9IGZhbHNlO1xuXG4gICAgICAgICAgY29uc3QgY2h1bmsxID0gY2h1bms7XG4gICAgICAgICAgbGV0IGNodW5rMiA9IGNodW5rO1xuICAgICAgICAgIGlmICghY2FuY2VsZWQxICYmICFjYW5jZWxlZDIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNodW5rMiA9IENsb25lQXNVaW50OEFycmF5KGNodW5rKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGNsb25lRSkge1xuICAgICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjbG9uZUUpO1xuICAgICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRXJyb3IoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjbG9uZUUpO1xuICAgICAgICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZShSZWFkYWJsZVN0cmVhbUNhbmNlbChzdHJlYW0sIGNsb25lRSkpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFjYW5jZWxlZDEpIHtcbiAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2h1bmsxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFjYW5jZWxlZDIpIHtcbiAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJFbnF1ZXVlKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2h1bmsyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHJlYWRBZ2FpbkZvckJyYW5jaDEpIHtcbiAgICAgICAgICAgIHB1bGwxQWxnb3JpdGhtKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZWFkQWdhaW5Gb3JCcmFuY2gyKSB7XG4gICAgICAgICAgICBwdWxsMkFsZ29yaXRobSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgX2Nsb3NlU3RlcHM6ICgpID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIWNhbmNlbGVkMSkge1xuICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJDbG9zZShicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY2FuY2VsZWQyKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckNsb3NlKGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJyYW5jaDEuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclJlc3BvbmQoYnJhbmNoMS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYnJhbmNoMi5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLl9wZW5kaW5nUHVsbEludG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZChicmFuY2gyLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIDApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY2FuY2VsZWQxIHx8ICFjYW5jZWxlZDIpIHtcbiAgICAgICAgICByZXNvbHZlQ2FuY2VsUHJvbWlzZSh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2Vycm9yU3RlcHM6ICgpID0+IHtcbiAgICAgICAgcmVhZGluZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG4gICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyUmVhZChyZWFkZXIsIHJlYWRSZXF1ZXN0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1bGxXaXRoQllPQlJlYWRlcih2aWV3OiBOb25TaGFyZWQ8QXJyYXlCdWZmZXJWaWV3PiwgZm9yQnJhbmNoMjogYm9vbGVhbikge1xuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxOb25TaGFyZWQ8VWludDhBcnJheT4+KHJlYWRlcikpIHtcbiAgICAgIGFzc2VydChyZWFkZXIuX3JlYWRSZXF1ZXN0cy5sZW5ndGggPT09IDApO1xuICAgICAgUmVhZGFibGVTdHJlYW1SZWFkZXJHZW5lcmljUmVsZWFzZShyZWFkZXIpO1xuXG4gICAgICByZWFkZXIgPSBBY3F1aXJlUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHN0cmVhbSk7XG4gICAgICBmb3J3YXJkUmVhZGVyRXJyb3IocmVhZGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBieW9iQnJhbmNoID0gZm9yQnJhbmNoMiA/IGJyYW5jaDIgOiBicmFuY2gxO1xuICAgIGNvbnN0IG90aGVyQnJhbmNoID0gZm9yQnJhbmNoMiA/IGJyYW5jaDEgOiBicmFuY2gyO1xuXG4gICAgY29uc3QgcmVhZEludG9SZXF1ZXN0OiBSZWFkSW50b1JlcXVlc3Q8Tm9uU2hhcmVkPEFycmF5QnVmZmVyVmlldz4+ID0ge1xuICAgICAgX2NodW5rU3RlcHM6IGNodW5rID0+IHtcbiAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWxheWVkIGEgbWljcm90YXNrIGJlY2F1c2UgaXQgdGFrZXMgYXQgbGVhc3QgYSBtaWNyb3Rhc2sgdG8gZGV0ZWN0IGVycm9ycyAodXNpbmdcbiAgICAgICAgLy8gcmVhZGVyLl9jbG9zZWRQcm9taXNlIGJlbG93KSwgYW5kIHdlIHdhbnQgZXJyb3JzIGluIHN0cmVhbSB0byBlcnJvciBib3RoIGJyYW5jaGVzIGltbWVkaWF0ZWx5LiBXZSBjYW5ub3QgbGV0XG4gICAgICAgIC8vIHN1Y2Nlc3NmdWwgc3luY2hyb25vdXNseS1hdmFpbGFibGUgcmVhZHMgZ2V0IGFoZWFkIG9mIGFzeW5jaHJvbm91c2x5LWF2YWlsYWJsZSBlcnJvcnMuXG4gICAgICAgIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICAgICAgICByZWFkQWdhaW5Gb3JCcmFuY2gxID0gZmFsc2U7XG4gICAgICAgICAgcmVhZEFnYWluRm9yQnJhbmNoMiA9IGZhbHNlO1xuXG4gICAgICAgICAgY29uc3QgYnlvYkNhbmNlbGVkID0gZm9yQnJhbmNoMiA/IGNhbmNlbGVkMiA6IGNhbmNlbGVkMTtcbiAgICAgICAgICBjb25zdCBvdGhlckNhbmNlbGVkID0gZm9yQnJhbmNoMiA/IGNhbmNlbGVkMSA6IGNhbmNlbGVkMjtcblxuICAgICAgICAgIGlmICghb3RoZXJDYW5jZWxlZCkge1xuICAgICAgICAgICAgbGV0IGNsb25lZENodW5rO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY2xvbmVkQ2h1bmsgPSBDbG9uZUFzVWludDhBcnJheShjaHVuayk7XG4gICAgICAgICAgICB9IGNhdGNoIChjbG9uZUUpIHtcbiAgICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKGJ5b2JCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2xvbmVFKTtcbiAgICAgICAgICAgICAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckVycm9yKG90aGVyQnJhbmNoLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIGNsb25lRSk7XG4gICAgICAgICAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgY2xvbmVFKSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYnlvYkNhbmNlbGVkKSB7XG4gICAgICAgICAgICAgIFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJSZXNwb25kV2l0aE5ld1ZpZXcoYnlvYkJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjaHVuayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyRW5xdWV1ZShvdGhlckJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCBjbG9uZWRDaHVuayk7XG4gICAgICAgICAgfSBlbHNlIGlmICghYnlvYkNhbmNlbGVkKSB7XG4gICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZFdpdGhOZXdWaWV3KGJ5b2JCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2h1bmspO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBpZiAocmVhZEFnYWluRm9yQnJhbmNoMSkge1xuICAgICAgICAgICAgcHVsbDFBbGdvcml0aG0oKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlYWRBZ2FpbkZvckJyYW5jaDIpIHtcbiAgICAgICAgICAgIHB1bGwyQWxnb3JpdGhtKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBfY2xvc2VTdGVwczogY2h1bmsgPT4ge1xuICAgICAgICByZWFkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgYnlvYkNhbmNlbGVkID0gZm9yQnJhbmNoMiA/IGNhbmNlbGVkMiA6IGNhbmNlbGVkMTtcbiAgICAgICAgY29uc3Qgb3RoZXJDYW5jZWxlZCA9IGZvckJyYW5jaDIgPyBjYW5jZWxlZDEgOiBjYW5jZWxlZDI7XG5cbiAgICAgICAgaWYgKCFieW9iQ2FuY2VsZWQpIHtcbiAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2UoYnlvYkJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW90aGVyQ2FuY2VsZWQpIHtcbiAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyQ2xvc2Uob3RoZXJCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2h1bmsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGFzc2VydChjaHVuay5ieXRlTGVuZ3RoID09PSAwKTtcblxuICAgICAgICAgIGlmICghYnlvYkNhbmNlbGVkKSB7XG4gICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZFdpdGhOZXdWaWV3KGJ5b2JCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgY2h1bmspO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIW90aGVyQ2FuY2VsZWQgJiYgb3RoZXJCcmFuY2guX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlci5fcGVuZGluZ1B1bGxJbnRvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyUmVzcG9uZChvdGhlckJyYW5jaC5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWJ5b2JDYW5jZWxlZCB8fCAhb3RoZXJDYW5jZWxlZCkge1xuICAgICAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfZXJyb3JTdGVwczogKCkgPT4ge1xuICAgICAgICByZWFkaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcbiAgICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkKHJlYWRlciwgdmlldywgMSwgcmVhZEludG9SZXF1ZXN0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1bGwxQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChyZWFkaW5nKSB7XG4gICAgICByZWFkQWdhaW5Gb3JCcmFuY2gxID0gdHJ1ZTtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgcmVhZGluZyA9IHRydWU7XG5cbiAgICBjb25zdCBieW9iUmVxdWVzdCA9IFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJHZXRCWU9CUmVxdWVzdChicmFuY2gxLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgIGlmIChieW9iUmVxdWVzdCA9PT0gbnVsbCkge1xuICAgICAgcHVsbFdpdGhEZWZhdWx0UmVhZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHB1bGxXaXRoQllPQlJlYWRlcihieW9iUmVxdWVzdC5fdmlldyEsIGZhbHNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVsbDJBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHJlYWRpbmcpIHtcbiAgICAgIHJlYWRBZ2FpbkZvckJyYW5jaDIgPSB0cnVlO1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICByZWFkaW5nID0gdHJ1ZTtcblxuICAgIGNvbnN0IGJ5b2JSZXF1ZXN0ID0gUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlckdldEJZT0JSZXF1ZXN0KGJyYW5jaDIuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcik7XG4gICAgaWYgKGJ5b2JSZXF1ZXN0ID09PSBudWxsKSB7XG4gICAgICBwdWxsV2l0aERlZmF1bHRSZWFkZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHVsbFdpdGhCWU9CUmVhZGVyKGJ5b2JSZXF1ZXN0Ll92aWV3ISwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbDFBbGdvcml0aG0ocmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjYW5jZWxlZDEgPSB0cnVlO1xuICAgIHJlYXNvbjEgPSByZWFzb247XG4gICAgaWYgKGNhbmNlbGVkMikge1xuICAgICAgY29uc3QgY29tcG9zaXRlUmVhc29uID0gQ3JlYXRlQXJyYXlGcm9tTGlzdChbcmVhc29uMSwgcmVhc29uMl0pO1xuICAgICAgY29uc3QgY2FuY2VsUmVzdWx0ID0gUmVhZGFibGVTdHJlYW1DYW5jZWwoc3RyZWFtLCBjb21wb3NpdGVSZWFzb24pO1xuICAgICAgcmVzb2x2ZUNhbmNlbFByb21pc2UoY2FuY2VsUmVzdWx0KTtcbiAgICB9XG4gICAgcmV0dXJuIGNhbmNlbFByb21pc2U7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwyQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY2FuY2VsZWQyID0gdHJ1ZTtcbiAgICByZWFzb24yID0gcmVhc29uO1xuICAgIGlmIChjYW5jZWxlZDEpIHtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZVJlYXNvbiA9IENyZWF0ZUFycmF5RnJvbUxpc3QoW3JlYXNvbjEsIHJlYXNvbjJdKTtcbiAgICAgIGNvbnN0IGNhbmNlbFJlc3VsdCA9IFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHN0cmVhbSwgY29tcG9zaXRlUmVhc29uKTtcbiAgICAgIHJlc29sdmVDYW5jZWxQcm9taXNlKGNhbmNlbFJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiBjYW5jZWxQcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnRBbGdvcml0aG0oKTogdm9pZCB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYnJhbmNoMSA9IENyZWF0ZVJlYWRhYmxlQnl0ZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbDFBbGdvcml0aG0sIGNhbmNlbDFBbGdvcml0aG0pO1xuICBicmFuY2gyID0gQ3JlYXRlUmVhZGFibGVCeXRlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCBwdWxsMkFsZ29yaXRobSwgY2FuY2VsMkFsZ29yaXRobSk7XG5cbiAgZm9yd2FyZFJlYWRlckVycm9yKHJlYWRlcik7XG5cbiAgcmV0dXJuIFticmFuY2gxLCBicmFuY2gyXTtcbn1cbiIsICJpbXBvcnQgeyB0eXBlSXNPYmplY3QgfSBmcm9tICcuLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHR5cGUgeyBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0IH0gZnJvbSAnLi9kZWZhdWx0LXJlYWRlcic7XG5cbi8qKlxuICogQSBjb21tb24gaW50ZXJmYWNlIGZvciBhIGBSZWFkYWRhYmxlU3RyZWFtYCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZGFibGVTdHJlYW1MaWtlPFIgPSBhbnk+IHtcbiAgcmVhZG9ubHkgbG9ja2VkOiBib29sZWFuO1xuXG4gIGdldFJlYWRlcigpOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJMaWtlPFI+O1xufVxuXG4vKipcbiAqIEEgY29tbW9uIGludGVyZmFjZSBmb3IgYSBgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyYCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyTGlrZTxSID0gYW55PiB7XG4gIHJlYWRvbmx5IGNsb3NlZDogUHJvbWlzZTx1bmRlZmluZWQ+O1xuXG4gIGNhbmNlbChyZWFzb24/OiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIHJlYWQoKTogUHJvbWlzZTxSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkUmVzdWx0PFI+PjtcblxuICByZWxlYXNlTG9jaygpOiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWFkYWJsZVN0cmVhbUxpa2U8Uj4oc3RyZWFtOiB1bmtub3duKTogc3RyZWFtIGlzIFJlYWRhYmxlU3RyZWFtTGlrZTxSPiB7XG4gIHJldHVybiB0eXBlSXNPYmplY3Qoc3RyZWFtKSAmJiB0eXBlb2YgKHN0cmVhbSBhcyBSZWFkYWJsZVN0cmVhbUxpa2U8Uj4pLmdldFJlYWRlciAhPT0gJ3VuZGVmaW5lZCc7XG59XG4iLCAiaW1wb3J0IHsgQ3JlYXRlUmVhZGFibGVTdHJlYW0sIHR5cGUgRGVmYXVsdFJlYWRhYmxlU3RyZWFtIH0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtJztcbmltcG9ydCB7XG4gIGlzUmVhZGFibGVTdHJlYW1MaWtlLFxuICB0eXBlIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckxpa2UsXG4gIHR5cGUgUmVhZGFibGVTdHJlYW1MaWtlXG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtLWxpa2UnO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlLCBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZSB9IGZyb20gJy4vZGVmYXVsdC1jb250cm9sbGVyJztcbmltcG9ydCB7IEdldEl0ZXJhdG9yLCBHZXRNZXRob2QsIEl0ZXJhdG9yQ29tcGxldGUsIEl0ZXJhdG9yTmV4dCwgSXRlcmF0b3JWYWx1ZSB9IGZyb20gJy4uL2Fic3RyYWN0LW9wcy9lY21hc2NyaXB0JztcbmltcG9ydCB7IHByb21pc2VSZWplY3RlZFdpdGgsIHByb21pc2VSZXNvbHZlZFdpdGgsIHJlZmxlY3RDYWxsLCB0cmFuc2Zvcm1Qcm9taXNlV2l0aCB9IGZyb20gJy4uL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IHR5cGVJc09iamVjdCB9IGZyb20gJy4uL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1Gcm9tPFI+KFxuICBzb3VyY2U6IEl0ZXJhYmxlPFI+IHwgQXN5bmNJdGVyYWJsZTxSPiB8IFJlYWRhYmxlU3RyZWFtTGlrZTxSPlxuKTogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+IHtcbiAgaWYgKGlzUmVhZGFibGVTdHJlYW1MaWtlKHNvdXJjZSkpIHtcbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1Gcm9tRGVmYXVsdFJlYWRlcihzb3VyY2UuZ2V0UmVhZGVyKCkpO1xuICB9XG4gIHJldHVybiBSZWFkYWJsZVN0cmVhbUZyb21JdGVyYWJsZShzb3VyY2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1Gcm9tSXRlcmFibGU8Uj4oYXN5bmNJdGVyYWJsZTogSXRlcmFibGU8Uj4gfCBBc3luY0l0ZXJhYmxlPFI+KTogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+IHtcbiAgbGV0IHN0cmVhbTogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+O1xuICBjb25zdCBpdGVyYXRvclJlY29yZCA9IEdldEl0ZXJhdG9yKGFzeW5jSXRlcmFibGUsICdhc3luYycpO1xuXG4gIGNvbnN0IHN0YXJ0QWxnb3JpdGhtID0gbm9vcDtcblxuICBmdW5jdGlvbiBwdWxsQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBuZXh0UmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICBuZXh0UmVzdWx0ID0gSXRlcmF0b3JOZXh0KGl0ZXJhdG9yUmVjb3JkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChlKTtcbiAgICB9XG4gICAgY29uc3QgbmV4dFByb21pc2UgPSBwcm9taXNlUmVzb2x2ZWRXaXRoKG5leHRSZXN1bHQpO1xuICAgIHJldHVybiB0cmFuc2Zvcm1Qcm9taXNlV2l0aChuZXh0UHJvbWlzZSwgaXRlclJlc3VsdCA9PiB7XG4gICAgICBpZiAoIXR5cGVJc09iamVjdChpdGVyUmVzdWx0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgcHJvbWlzZSByZXR1cm5lZCBieSB0aGUgaXRlcmF0b3IubmV4dCgpIG1ldGhvZCBtdXN0IGZ1bGZpbGwgd2l0aCBhbiBvYmplY3QnKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRvbmUgPSBJdGVyYXRvckNvbXBsZXRlKGl0ZXJSZXN1bHQpO1xuICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsb3NlKHN0cmVhbS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gSXRlcmF0b3JWYWx1ZShpdGVyUmVzdWx0KTtcbiAgICAgICAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbEFsZ29yaXRobShyZWFzb246IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGl0ZXJhdG9yID0gaXRlcmF0b3JSZWNvcmQuaXRlcmF0b3I7XG4gICAgbGV0IHJldHVybk1ldGhvZDogKHR5cGVvZiBpdGVyYXRvcilbJ3JldHVybiddIHwgdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm5NZXRob2QgPSBHZXRNZXRob2QoaXRlcmF0b3IsICdyZXR1cm4nKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChlKTtcbiAgICB9XG4gICAgaWYgKHJldHVybk1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmVkV2l0aCh1bmRlZmluZWQpO1xuICAgIH1cbiAgICBsZXQgcmV0dXJuUmVzdWx0OiBJdGVyYXRvclJlc3VsdDxSPiB8IFByb21pc2U8SXRlcmF0b3JSZXN1bHQ8Uj4+O1xuICAgIHRyeSB7XG4gICAgICByZXR1cm5SZXN1bHQgPSByZWZsZWN0Q2FsbChyZXR1cm5NZXRob2QsIGl0ZXJhdG9yLCBbcmVhc29uXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuICAgIGNvbnN0IHJldHVyblByb21pc2UgPSBwcm9taXNlUmVzb2x2ZWRXaXRoKHJldHVyblJlc3VsdCk7XG4gICAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKHJldHVyblByb21pc2UsIGl0ZXJSZXN1bHQgPT4ge1xuICAgICAgaWYgKCF0eXBlSXNPYmplY3QoaXRlclJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHByb21pc2UgcmV0dXJuZWQgYnkgdGhlIGl0ZXJhdG9yLnJldHVybigpIG1ldGhvZCBtdXN0IGZ1bGZpbGwgd2l0aCBhbiBvYmplY3QnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH1cblxuICBzdHJlYW0gPSBDcmVhdGVSZWFkYWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgcHVsbEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtLCAwKTtcbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRnJvbURlZmF1bHRSZWFkZXI8Uj4oXG4gIHJlYWRlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyTGlrZTxSPlxuKTogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+IHtcbiAgbGV0IHN0cmVhbTogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+O1xuXG4gIGNvbnN0IHN0YXJ0QWxnb3JpdGhtID0gbm9vcDtcblxuICBmdW5jdGlvbiBwdWxsQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCByZWFkUHJvbWlzZTtcbiAgICB0cnkge1xuICAgICAgcmVhZFByb21pc2UgPSByZWFkZXIucmVhZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKGUpO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgocmVhZFByb21pc2UsIHJlYWRSZXN1bHQgPT4ge1xuICAgICAgaWYgKCF0eXBlSXNPYmplY3QocmVhZFJlc3VsdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIHByb21pc2UgcmV0dXJuZWQgYnkgdGhlIHJlYWRlci5yZWFkKCkgbWV0aG9kIG11c3QgZnVsZmlsbCB3aXRoIGFuIG9iamVjdCcpO1xuICAgICAgfVxuICAgICAgaWYgKHJlYWRSZXN1bHQuZG9uZSkge1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xvc2Uoc3RyZWFtLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSByZWFkUmVzdWx0LnZhbHVlO1xuICAgICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZShzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHJlYWRlci5jYW5jZWwocmVhc29uKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuICB9XG5cbiAgc3RyZWFtID0gQ3JlYXRlUmVhZGFibGVTdHJlYW0oc3RhcnRBbGdvcml0aG0sIHB1bGxBbGdvcml0aG0sIGNhbmNlbEFsZ29yaXRobSwgMCk7XG4gIHJldHVybiBzdHJlYW07XG59XG4iLCAiaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSwgYXNzZXJ0RnVuY3Rpb24sIGNvbnZlcnRVbnNpZ25lZExvbmdMb25nV2l0aEVuZm9yY2VSYW5nZSB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHR5cGUge1xuICBSZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIsXG4gIFVuZGVybHlpbmdCeXRlU291cmNlLFxuICBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZSxcbiAgVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2VQdWxsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlU3RhcnRDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NvdXJjZSxcbiAgVW5kZXJseWluZ1NvdXJjZUNhbmNlbENhbGxiYWNrLFxuICBWYWxpZGF0ZWRVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZVxufSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0vdW5kZXJseWluZy1zb3VyY2UnO1xuaW1wb3J0IHsgcHJvbWlzZUNhbGwsIHJlZmxlY3RDYWxsIH0gZnJvbSAnLi4vaGVscGVycy93ZWJpZGwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlPFI+KFxuICBzb3VyY2U6IFVuZGVybHlpbmdTb3VyY2U8Uj4gfCBVbmRlcmx5aW5nQnl0ZVNvdXJjZSB8IG51bGwsXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogVmFsaWRhdGVkVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2U8Uj4ge1xuICBhc3NlcnREaWN0aW9uYXJ5KHNvdXJjZSwgY29udGV4dCk7XG4gIGNvbnN0IG9yaWdpbmFsID0gc291cmNlIGFzIChVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZTxSPiB8IG51bGwpO1xuICBjb25zdCBhdXRvQWxsb2NhdGVDaHVua1NpemUgPSBvcmlnaW5hbD8uYXV0b0FsbG9jYXRlQ2h1bmtTaXplO1xuICBjb25zdCBjYW5jZWwgPSBvcmlnaW5hbD8uY2FuY2VsO1xuICBjb25zdCBwdWxsID0gb3JpZ2luYWw/LnB1bGw7XG4gIGNvbnN0IHN0YXJ0ID0gb3JpZ2luYWw/LnN0YXJ0O1xuICBjb25zdCB0eXBlID0gb3JpZ2luYWw/LnR5cGU7XG4gIHJldHVybiB7XG4gICAgYXV0b0FsbG9jYXRlQ2h1bmtTaXplOiBhdXRvQWxsb2NhdGVDaHVua1NpemUgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuc2lnbmVkTG9uZ0xvbmdXaXRoRW5mb3JjZVJhbmdlKFxuICAgICAgICBhdXRvQWxsb2NhdGVDaHVua1NpemUsXG4gICAgICAgIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ2F1dG9BbGxvY2F0ZUNodW5rU2l6ZScgdGhhdGBcbiAgICAgICksXG4gICAgY2FuY2VsOiBjYW5jZWwgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTb3VyY2VDYW5jZWxDYWxsYmFjayhjYW5jZWwsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnY2FuY2VsJyB0aGF0YCksXG4gICAgcHVsbDogcHVsbCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VW5kZXJseWluZ1NvdXJjZVB1bGxDYWxsYmFjayhwdWxsLCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3B1bGwnIHRoYXRgKSxcbiAgICBzdGFydDogc3RhcnQgPT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOlxuICAgICAgY29udmVydFVuZGVybHlpbmdTb3VyY2VTdGFydENhbGxiYWNrKHN0YXJ0LCBvcmlnaW5hbCEsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3N0YXJ0JyB0aGF0YCksXG4gICAgdHlwZTogdHlwZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogY29udmVydFJlYWRhYmxlU3RyZWFtVHlwZSh0eXBlLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICd0eXBlJyB0aGF0YClcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydFVuZGVybHlpbmdTb3VyY2VDYW5jZWxDYWxsYmFjayhcbiAgZm46IFVuZGVybHlpbmdTb3VyY2VDYW5jZWxDYWxsYmFjayxcbiAgb3JpZ2luYWw6IFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlLFxuICBjb250ZXh0OiBzdHJpbmdcbik6IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChyZWFzb246IGFueSkgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbcmVhc29uXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbmRlcmx5aW5nU291cmNlUHVsbENhbGxiYWNrPFI+KFxuICBmbjogVW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2VQdWxsQ2FsbGJhY2s8Uj4sXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZTxSPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiAoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1Db250cm9sbGVyPFI+KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNvbnRyb2xsZXI6IFJlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjxSPikgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbY29udHJvbGxlcl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VW5kZXJseWluZ1NvdXJjZVN0YXJ0Q2FsbGJhY2s8Uj4oXG4gIGZuOiBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZVN0YXJ0Q2FsbGJhY2s8Uj4sXG4gIG9yaWdpbmFsOiBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZTxSPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiBVbmRlcmx5aW5nRGVmYXVsdE9yQnl0ZVNvdXJjZVN0YXJ0Q2FsbGJhY2s8Uj4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1Db250cm9sbGVyPFI+KSA9PiByZWZsZWN0Q2FsbChmbiwgb3JpZ2luYWwsIFtjb250cm9sbGVyXSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRSZWFkYWJsZVN0cmVhbVR5cGUodHlwZTogc3RyaW5nLCBjb250ZXh0OiBzdHJpbmcpOiAnYnl0ZXMnIHtcbiAgdHlwZSA9IGAke3R5cGV9YDtcbiAgaWYgKHR5cGUgIT09ICdieXRlcycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NvbnRleHR9ICcke3R5cGV9JyBpcyBub3QgYSB2YWxpZCBlbnVtZXJhdGlvbiB2YWx1ZSBmb3IgUmVhZGFibGVTdHJlYW1UeXBlYCk7XG4gIH1cbiAgcmV0dXJuIHR5cGU7XG59XG4iLCAiaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHR5cGUge1xuICBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyxcbiAgVmFsaWRhdGVkUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnNcbn0gZnJvbSAnLi4vcmVhZGFibGUtc3RyZWFtL2l0ZXJhdG9yLW9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydEl0ZXJhdG9yT3B0aW9ucyhvcHRpb25zOiBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBzdHJpbmcpOiBWYWxpZGF0ZWRSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyB7XG4gIGFzc2VydERpY3Rpb25hcnkob3B0aW9ucywgY29udGV4dCk7XG4gIGNvbnN0IHByZXZlbnRDYW5jZWwgPSBvcHRpb25zPy5wcmV2ZW50Q2FuY2VsO1xuICByZXR1cm4geyBwcmV2ZW50Q2FuY2VsOiBCb29sZWFuKHByZXZlbnRDYW5jZWwpIH07XG59XG4iLCAiaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHR5cGUgeyBTdHJlYW1QaXBlT3B0aW9ucywgVmFsaWRhdGVkU3RyZWFtUGlwZU9wdGlvbnMgfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0vcGlwZS1vcHRpb25zJztcbmltcG9ydCB7IHR5cGUgQWJvcnRTaWduYWwsIGlzQWJvcnRTaWduYWwgfSBmcm9tICcuLi9hYm9ydC1zaWduYWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFBpcGVPcHRpb25zKG9wdGlvbnM6IFN0cmVhbVBpcGVPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogVmFsaWRhdGVkU3RyZWFtUGlwZU9wdGlvbnMge1xuICBhc3NlcnREaWN0aW9uYXJ5KG9wdGlvbnMsIGNvbnRleHQpO1xuICBjb25zdCBwcmV2ZW50QWJvcnQgPSBvcHRpb25zPy5wcmV2ZW50QWJvcnQ7XG4gIGNvbnN0IHByZXZlbnRDYW5jZWwgPSBvcHRpb25zPy5wcmV2ZW50Q2FuY2VsO1xuICBjb25zdCBwcmV2ZW50Q2xvc2UgPSBvcHRpb25zPy5wcmV2ZW50Q2xvc2U7XG4gIGNvbnN0IHNpZ25hbCA9IG9wdGlvbnM/LnNpZ25hbDtcbiAgaWYgKHNpZ25hbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYXNzZXJ0QWJvcnRTaWduYWwoc2lnbmFsLCBgJHtjb250ZXh0fSBoYXMgbWVtYmVyICdzaWduYWwnIHRoYXRgKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHByZXZlbnRBYm9ydDogQm9vbGVhbihwcmV2ZW50QWJvcnQpLFxuICAgIHByZXZlbnRDYW5jZWw6IEJvb2xlYW4ocHJldmVudENhbmNlbCksXG4gICAgcHJldmVudENsb3NlOiBCb29sZWFuKHByZXZlbnRDbG9zZSksXG4gICAgc2lnbmFsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGFzc2VydEFib3J0U2lnbmFsKHNpZ25hbDogdW5rbm93biwgY29udGV4dDogc3RyaW5nKTogYXNzZXJ0cyBzaWduYWwgaXMgQWJvcnRTaWduYWwge1xuICBpZiAoIWlzQWJvcnRTaWduYWwoc2lnbmFsKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7Y29udGV4dH0gaXMgbm90IGFuIEFib3J0U2lnbmFsLmApO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSwgYXNzZXJ0UmVxdWlyZWRGaWVsZCB9IGZyb20gJy4vYmFzaWMnO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW0gfSBmcm9tICcuLi9yZWFkYWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgV3JpdGFibGVTdHJlYW0gfSBmcm9tICcuLi93cml0YWJsZS1zdHJlYW0nO1xuaW1wb3J0IHsgYXNzZXJ0UmVhZGFibGVTdHJlYW0gfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBhc3NlcnRXcml0YWJsZVN0cmVhbSB9IGZyb20gJy4vd3JpdGFibGUtc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRSZWFkYWJsZVdyaXRhYmxlUGFpcjxSUyBleHRlbmRzIFJlYWRhYmxlU3RyZWFtLCBXUyBleHRlbmRzIFdyaXRhYmxlU3RyZWFtPihcbiAgcGFpcjogeyByZWFkYWJsZTogUlM7IHdyaXRhYmxlOiBXUyB9IHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgY29udGV4dDogc3RyaW5nXG4pOiB7IHJlYWRhYmxlOiBSUzsgd3JpdGFibGU6IFdTIH0ge1xuICBhc3NlcnREaWN0aW9uYXJ5KHBhaXIsIGNvbnRleHQpO1xuXG4gIGNvbnN0IHJlYWRhYmxlID0gcGFpcj8ucmVhZGFibGU7XG4gIGFzc2VydFJlcXVpcmVkRmllbGQocmVhZGFibGUsICdyZWFkYWJsZScsICdSZWFkYWJsZVdyaXRhYmxlUGFpcicpO1xuICBhc3NlcnRSZWFkYWJsZVN0cmVhbShyZWFkYWJsZSwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAncmVhZGFibGUnIHRoYXRgKTtcblxuICBjb25zdCB3cml0YWJsZSA9IHBhaXI/LndyaXRhYmxlO1xuICBhc3NlcnRSZXF1aXJlZEZpZWxkKHdyaXRhYmxlLCAnd3JpdGFibGUnLCAnUmVhZGFibGVXcml0YWJsZVBhaXInKTtcbiAgYXNzZXJ0V3JpdGFibGVTdHJlYW0od3JpdGFibGUsIGAke2NvbnRleHR9IGhhcyBtZW1iZXIgJ3dyaXRhYmxlJyB0aGF0YCk7XG5cbiAgcmV0dXJuIHsgcmVhZGFibGUsIHdyaXRhYmxlIH07XG59XG4iLCAiaW1wb3J0IGFzc2VydCBmcm9tICcuLi9zdHViL2Fzc2VydCc7XG5pbXBvcnQge1xuICBwcm9taXNlUmVqZWN0ZWRXaXRoLFxuICBwcm9taXNlUmVzb2x2ZWRXaXRoLFxuICBzZXRQcm9taXNlSXNIYW5kbGVkVG9UcnVlLFxuICB0cmFuc2Zvcm1Qcm9taXNlV2l0aFxufSBmcm9tICcuL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5LCBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2sgfSBmcm9tICcuL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgQWNxdWlyZVJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvciwgdHlwZSBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IgfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9hc3luYy1pdGVyYXRvcic7XG5pbXBvcnQgeyBkZWZhdWx0UmVhZGVyQ2xvc2VkUHJvbWlzZVJlamVjdCwgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZXNvbHZlIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vZ2VuZXJpYy1yZWFkZXInO1xuaW1wb3J0IHtcbiAgQWNxdWlyZVJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyRXJyb3JSZWFkUmVxdWVzdHMsXG4gIHR5cGUgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZFJlc3VsdFxufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9kZWZhdWx0LXJlYWRlcic7XG5pbXBvcnQge1xuICBBY3F1aXJlUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLFxuICBJc1JlYWRhYmxlU3RyZWFtQllPQlJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJFcnJvclJlYWRJbnRvUmVxdWVzdHMsXG4gIHR5cGUgUmVhZGFibGVTdHJlYW1CWU9CUmVhZFJlc3VsdFxufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9ieW9iLXJlYWRlcic7XG5pbXBvcnQgeyBSZWFkYWJsZVN0cmVhbVBpcGVUbyB9IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3BpcGUnO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1UZWUgfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS90ZWUnO1xuaW1wb3J0IHsgUmVhZGFibGVTdHJlYW1Gcm9tIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vZnJvbSc7XG5pbXBvcnQgeyBJc1dyaXRhYmxlU3RyZWFtLCBJc1dyaXRhYmxlU3RyZWFtTG9ja2VkLCBXcml0YWJsZVN0cmVhbSB9IGZyb20gJy4vd3JpdGFibGUtc3RyZWFtJztcbmltcG9ydCB7IFNpbXBsZVF1ZXVlIH0gZnJvbSAnLi9zaW1wbGUtcXVldWUnO1xuaW1wb3J0IHtcbiAgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcixcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVxdWVzdCxcbiAgU2V0VXBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLFxuICBTZXRVcFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1NvdXJjZVxufSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9ieXRlLXN0cmVhbS1jb250cm9sbGVyJztcbmltcG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIsXG4gIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcixcbiAgU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2Vcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vZGVmYXVsdC1jb250cm9sbGVyJztcbmltcG9ydCB0eXBlIHtcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2UsXG4gIFVuZGVybHlpbmdCeXRlU291cmNlUHVsbENhbGxiYWNrLFxuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZVN0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2UsXG4gIFVuZGVybHlpbmdTb3VyY2VDYW5jZWxDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NvdXJjZVB1bGxDYWxsYmFjayxcbiAgVW5kZXJseWluZ1NvdXJjZVN0YXJ0Q2FsbGJhY2tcbn0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vdW5kZXJseWluZy1zb3VyY2UnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHNldEZ1bmN0aW9uTmFtZSwgdHlwZUlzT2JqZWN0IH0gZnJvbSAnLi9oZWxwZXJzL21pc2NlbGxhbmVvdXMnO1xuaW1wb3J0IHsgQ3JlYXRlQXJyYXlGcm9tTGlzdCwgU3ltYm9sQXN5bmNJdGVyYXRvciB9IGZyb20gJy4vYWJzdHJhY3Qtb3BzL2VjbWFzY3JpcHQnO1xuaW1wb3J0IHsgQ2FuY2VsU3RlcHMgfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9pbnRlcm5hbC1tZXRob2RzJztcbmltcG9ydCB7IElzTm9uTmVnYXRpdmVOdW1iZXIgfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IGFzc2VydE9iamVjdCwgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudCB9IGZyb20gJy4vdmFsaWRhdG9ycy9iYXNpYyc7XG5pbXBvcnQgeyBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5IH0gZnJvbSAnLi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgRXh0cmFjdEhpZ2hXYXRlck1hcmssIEV4dHJhY3RTaXplQWxnb3JpdGhtIH0gZnJvbSAnLi9hYnN0cmFjdC1vcHMvcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBjb252ZXJ0VW5kZXJseWluZ0RlZmF1bHRPckJ5dGVTb3VyY2UgfSBmcm9tICcuL3ZhbGlkYXRvcnMvdW5kZXJseWluZy1zb3VyY2UnO1xuaW1wb3J0IHR5cGUge1xuICBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJSZWFkT3B0aW9ucyxcbiAgUmVhZGFibGVTdHJlYW1HZXRSZWFkZXJPcHRpb25zXG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL3JlYWRlci1vcHRpb25zJztcbmltcG9ydCB7IGNvbnZlcnRSZWFkZXJPcHRpb25zIH0gZnJvbSAnLi92YWxpZGF0b3JzL3JlYWRlci1vcHRpb25zJztcbmltcG9ydCB0eXBlIHsgU3RyZWFtUGlwZU9wdGlvbnMsIFZhbGlkYXRlZFN0cmVhbVBpcGVPcHRpb25zIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vcGlwZS1vcHRpb25zJztcbmltcG9ydCB0eXBlIHsgUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMgfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9pdGVyYXRvci1vcHRpb25zJztcbmltcG9ydCB7IGNvbnZlcnRJdGVyYXRvck9wdGlvbnMgfSBmcm9tICcuL3ZhbGlkYXRvcnMvaXRlcmF0b3Itb3B0aW9ucyc7XG5pbXBvcnQgeyBjb252ZXJ0UGlwZU9wdGlvbnMgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcGlwZS1vcHRpb25zJztcbmltcG9ydCB0eXBlIHsgUmVhZGFibGVXcml0YWJsZVBhaXIgfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS13cml0YWJsZS1wYWlyJztcbmltcG9ydCB7IGNvbnZlcnRSZWFkYWJsZVdyaXRhYmxlUGFpciB9IGZyb20gJy4vdmFsaWRhdG9ycy9yZWFkYWJsZS13cml0YWJsZS1wYWlyJztcbmltcG9ydCB0eXBlIHsgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyTGlrZSwgUmVhZGFibGVTdHJlYW1MaWtlIH0gZnJvbSAnLi9yZWFkYWJsZS1zdHJlYW0vcmVhZGFibGUtc3RyZWFtLWxpa2UnO1xuaW1wb3J0IHR5cGUgeyBOb25TaGFyZWQgfSBmcm9tICcuL2hlbHBlcnMvYXJyYXktYnVmZmVyLXZpZXcnO1xuXG5leHBvcnQgdHlwZSBEZWZhdWx0UmVhZGFibGVTdHJlYW08UiA9IGFueT4gPSBSZWFkYWJsZVN0cmVhbTxSPiAmIHtcbiAgX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjogUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxSPlxufTtcblxuZXhwb3J0IHR5cGUgUmVhZGFibGVCeXRlU3RyZWFtID0gUmVhZGFibGVTdHJlYW08Tm9uU2hhcmVkPFVpbnQ4QXJyYXk+PiAmIHtcbiAgX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcjogUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlclxufTtcblxudHlwZSBSZWFkYWJsZVN0cmVhbVN0YXRlID0gJ3JlYWRhYmxlJyB8ICdjbG9zZWQnIHwgJ2Vycm9yZWQnO1xuXG4vKipcbiAqIEEgcmVhZGFibGUgc3RyZWFtIHJlcHJlc2VudHMgYSBzb3VyY2Ugb2YgZGF0YSwgZnJvbSB3aGljaCB5b3UgY2FuIHJlYWQuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVhZGFibGVTdHJlYW08UiA9IGFueT4gaW1wbGVtZW50cyBBc3luY0l0ZXJhYmxlPFI+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3RhdGUhOiBSZWFkYWJsZVN0cmVhbVN0YXRlO1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkZXI6IFJlYWRhYmxlU3RyZWFtUmVhZGVyPFI+IHwgdW5kZWZpbmVkO1xuICAvKiogQGludGVybmFsICovXG4gIF9zdG9yZWRFcnJvcjogYW55O1xuICAvKiogQGludGVybmFsICovXG4gIF9kaXN0dXJiZWQhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXIhOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+IHwgUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcjtcblxuICBjb25zdHJ1Y3Rvcih1bmRlcmx5aW5nU291cmNlOiBVbmRlcmx5aW5nQnl0ZVNvdXJjZSwgc3RyYXRlZ3k/OiB7IGhpZ2hXYXRlck1hcms/OiBudW1iZXI7IHNpemU/OiB1bmRlZmluZWQgfSk7XG4gIGNvbnN0cnVjdG9yKHVuZGVybHlpbmdTb3VyY2U/OiBVbmRlcmx5aW5nU291cmNlPFI+LCBzdHJhdGVneT86IFF1ZXVpbmdTdHJhdGVneTxSPik7XG4gIGNvbnN0cnVjdG9yKHJhd1VuZGVybHlpbmdTb3VyY2U6IFVuZGVybHlpbmdTb3VyY2U8Uj4gfCBVbmRlcmx5aW5nQnl0ZVNvdXJjZSB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSxcbiAgICAgICAgICAgICAgcmF3U3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneTxSPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSkge1xuICAgIGlmIChyYXdVbmRlcmx5aW5nU291cmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJhd1VuZGVybHlpbmdTb3VyY2UgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NlcnRPYmplY3QocmF3VW5kZXJseWluZ1NvdXJjZSwgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gY29udmVydFF1ZXVpbmdTdHJhdGVneShyYXdTdHJhdGVneSwgJ1NlY29uZCBwYXJhbWV0ZXInKTtcbiAgICBjb25zdCB1bmRlcmx5aW5nU291cmNlID0gY29udmVydFVuZGVybHlpbmdEZWZhdWx0T3JCeXRlU291cmNlKHJhd1VuZGVybHlpbmdTb3VyY2UsICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIEluaXRpYWxpemVSZWFkYWJsZVN0cmVhbSh0aGlzKTtcblxuICAgIGlmICh1bmRlcmx5aW5nU291cmNlLnR5cGUgPT09ICdieXRlcycpIHtcbiAgICAgIGlmIChzdHJhdGVneS5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSBzdHJhdGVneSBmb3IgYSBieXRlIHN0cmVhbSBjYW5ub3QgaGF2ZSBhIHNpemUgZnVuY3Rpb24nKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGhpZ2hXYXRlck1hcmsgPSBFeHRyYWN0SGlnaFdhdGVyTWFyayhzdHJhdGVneSwgMCk7XG4gICAgICBTZXRVcFJlYWRhYmxlQnl0ZVN0cmVhbUNvbnRyb2xsZXJGcm9tVW5kZXJseWluZ1NvdXJjZShcbiAgICAgICAgdGhpcyBhcyB1bmtub3duIGFzIFJlYWRhYmxlQnl0ZVN0cmVhbSxcbiAgICAgICAgdW5kZXJseWluZ1NvdXJjZSxcbiAgICAgICAgaGlnaFdhdGVyTWFya1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXJ0KHVuZGVybHlpbmdTb3VyY2UudHlwZSA9PT0gdW5kZWZpbmVkKTtcbiAgICAgIGNvbnN0IHNpemVBbGdvcml0aG0gPSBFeHRyYWN0U2l6ZUFsZ29yaXRobShzdHJhdGVneSk7XG4gICAgICBjb25zdCBoaWdoV2F0ZXJNYXJrID0gRXh0cmFjdEhpZ2hXYXRlck1hcmsoc3RyYXRlZ3ksIDEpO1xuICAgICAgU2V0VXBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVVuZGVybHlpbmdTb3VyY2UoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIHVuZGVybHlpbmdTb3VyY2UsXG4gICAgICAgIGhpZ2hXYXRlck1hcmssXG4gICAgICAgIHNpemVBbGdvcml0aG1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSByZWFkYWJsZSBzdHJlYW0gaXMgbG9ja2VkIHRvIGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlciB8IHJlYWRlcn0uXG4gICAqL1xuICBnZXQgbG9ja2VkKCk6IGJvb2xlYW4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIElzUmVhZGFibGVTdHJlYW1Mb2NrZWQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VscyB0aGUgc3RyZWFtLCBzaWduYWxpbmcgYSBsb3NzIG9mIGludGVyZXN0IGluIHRoZSBzdHJlYW0gYnkgYSBjb25zdW1lci5cbiAgICpcbiAgICogVGhlIHN1cHBsaWVkIGByZWFzb25gIGFyZ3VtZW50IHdpbGwgYmUgZ2l2ZW4gdG8gdGhlIHVuZGVybHlpbmcgc291cmNlJ3Mge0BsaW5rIFVuZGVybHlpbmdTb3VyY2UuY2FuY2VsIHwgY2FuY2VsKCl9XG4gICAqIG1ldGhvZCwgd2hpY2ggbWlnaHQgb3IgbWlnaHQgbm90IHVzZSBpdC5cbiAgICovXG4gIGNhbmNlbChyZWFzb246IGFueSA9IHVuZGVmaW5lZCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignY2FuY2VsJykpO1xuICAgIH1cblxuICAgIGlmIChJc1JlYWRhYmxlU3RyZWFtTG9ja2VkKHRoaXMpKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FuY2VsIGEgc3RyZWFtIHRoYXQgYWxyZWFkeSBoYXMgYSByZWFkZXInKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtQ2FuY2VsKHRoaXMsIHJlYXNvbik7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHtAbGluayBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXJ9IGFuZCBsb2NrcyB0aGUgc3RyZWFtIHRvIHRoZSBuZXcgcmVhZGVyLlxuICAgKlxuICAgKiBUaGlzIGNhbGwgYmVoYXZlcyB0aGUgc2FtZSB3YXkgYXMgdGhlIG5vLWFyZ3VtZW50IHZhcmlhbnQsIGV4Y2VwdCB0aGF0IGl0IG9ubHkgd29ya3Mgb24gcmVhZGFibGUgYnl0ZSBzdHJlYW1zLFxuICAgKiBpLmUuIHN0cmVhbXMgd2hpY2ggd2VyZSBjb25zdHJ1Y3RlZCBzcGVjaWZpY2FsbHkgd2l0aCB0aGUgYWJpbGl0eSB0byBoYW5kbGUgXCJicmluZyB5b3VyIG93biBidWZmZXJcIiByZWFkaW5nLlxuICAgKiBUaGUgcmV0dXJuZWQgQllPQiByZWFkZXIgcHJvdmlkZXMgdGhlIGFiaWxpdHkgdG8gZGlyZWN0bHkgcmVhZCBpbmRpdmlkdWFsIGNodW5rcyBmcm9tIHRoZSBzdHJlYW0gdmlhIGl0c1xuICAgKiB7QGxpbmsgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyLnJlYWQgfCByZWFkKCl9IG1ldGhvZCwgaW50byBkZXZlbG9wZXItc3VwcGxpZWQgYnVmZmVycywgYWxsb3dpbmcgbW9yZSBwcmVjaXNlXG4gICAqIGNvbnRyb2wgb3ZlciBhbGxvY2F0aW9uLlxuICAgKi9cbiAgZ2V0UmVhZGVyKHsgbW9kZSB9OiB7IG1vZGU6ICdieW9iJyB9KTogUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyO1xuICAvKipcbiAgICogQ3JlYXRlcyBhIHtAbGluayBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJ9IGFuZCBsb2NrcyB0aGUgc3RyZWFtIHRvIHRoZSBuZXcgcmVhZGVyLlxuICAgKiBXaGlsZSB0aGUgc3RyZWFtIGlzIGxvY2tlZCwgbm8gb3RoZXIgcmVhZGVyIGNhbiBiZSBhY3F1aXJlZCB1bnRpbCB0aGlzIG9uZSBpcyByZWxlYXNlZC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbmFsaXR5IGlzIGVzcGVjaWFsbHkgdXNlZnVsIGZvciBjcmVhdGluZyBhYnN0cmFjdGlvbnMgdGhhdCBkZXNpcmUgdGhlIGFiaWxpdHkgdG8gY29uc3VtZSBhIHN0cmVhbVxuICAgKiBpbiBpdHMgZW50aXJldHkuIEJ5IGdldHRpbmcgYSByZWFkZXIgZm9yIHRoZSBzdHJlYW0sIHlvdSBjYW4gZW5zdXJlIG5vYm9keSBlbHNlIGNhbiBpbnRlcmxlYXZlIHJlYWRzIHdpdGggeW91cnNcbiAgICogb3IgY2FuY2VsIHRoZSBzdHJlYW0sIHdoaWNoIHdvdWxkIGludGVyZmVyZSB3aXRoIHlvdXIgYWJzdHJhY3Rpb24uXG4gICAqL1xuICBnZXRSZWFkZXIoKTogUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+O1xuICBnZXRSZWFkZXIoXG4gICAgcmF3T3B0aW9uczogUmVhZGFibGVTdHJlYW1HZXRSZWFkZXJPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICApOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4gfCBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbignZ2V0UmVhZGVyJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnZlcnRSZWFkZXJPcHRpb25zKHJhd09wdGlvbnMsICdGaXJzdCBwYXJhbWV0ZXInKTtcblxuICAgIGlmIChvcHRpb25zLm1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIEFjcXVpcmVSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXIodGhpcyk7XG4gICAgfVxuXG4gICAgYXNzZXJ0KG9wdGlvbnMubW9kZSA9PT0gJ2J5b2InKTtcbiAgICByZXR1cm4gQWNxdWlyZVJlYWRhYmxlU3RyZWFtQllPQlJlYWRlcih0aGlzIGFzIHVua25vd24gYXMgUmVhZGFibGVCeXRlU3RyZWFtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIGNvbnZlbmllbnQsIGNoYWluYWJsZSB3YXkgb2YgcGlwaW5nIHRoaXMgcmVhZGFibGUgc3RyZWFtIHRocm91Z2ggYSB0cmFuc2Zvcm0gc3RyZWFtXG4gICAqIChvciBhbnkgb3RoZXIgYHsgd3JpdGFibGUsIHJlYWRhYmxlIH1gIHBhaXIpLiBJdCBzaW1wbHkge0BsaW5rIFJlYWRhYmxlU3RyZWFtLnBpcGVUbyB8IHBpcGVzfSB0aGUgc3RyZWFtXG4gICAqIGludG8gdGhlIHdyaXRhYmxlIHNpZGUgb2YgdGhlIHN1cHBsaWVkIHBhaXIsIGFuZCByZXR1cm5zIHRoZSByZWFkYWJsZSBzaWRlIGZvciBmdXJ0aGVyIHVzZS5cbiAgICpcbiAgICogUGlwaW5nIGEgc3RyZWFtIHdpbGwgbG9jayBpdCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSBwaXBlLCBwcmV2ZW50aW5nIGFueSBvdGhlciBjb25zdW1lciBmcm9tIGFjcXVpcmluZyBhIHJlYWRlci5cbiAgICovXG4gIHBpcGVUaHJvdWdoPFJTIGV4dGVuZHMgUmVhZGFibGVTdHJlYW0+KFxuICAgIHRyYW5zZm9ybTogeyByZWFkYWJsZTogUlM7IHdyaXRhYmxlOiBXcml0YWJsZVN0cmVhbTxSPiB9LFxuICAgIG9wdGlvbnM/OiBTdHJlYW1QaXBlT3B0aW9uc1xuICApOiBSUztcbiAgcGlwZVRocm91Z2g8UlMgZXh0ZW5kcyBSZWFkYWJsZVN0cmVhbT4oXG4gICAgcmF3VHJhbnNmb3JtOiB7IHJlYWRhYmxlOiBSUzsgd3JpdGFibGU6IFdyaXRhYmxlU3RyZWFtPFI+IH0gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIHJhd09wdGlvbnM6IFN0cmVhbVBpcGVPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9XG4gICk6IFJTIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ3BpcGVUaHJvdWdoJyk7XG4gICAgfVxuICAgIGFzc2VydFJlcXVpcmVkQXJndW1lbnQocmF3VHJhbnNmb3JtLCAxLCAncGlwZVRocm91Z2gnKTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGNvbnZlcnRSZWFkYWJsZVdyaXRhYmxlUGFpcihyYXdUcmFuc2Zvcm0sICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICBjb25zdCBvcHRpb25zID0gY29udmVydFBpcGVPcHRpb25zKHJhd09wdGlvbnMsICdTZWNvbmQgcGFyYW1ldGVyJyk7XG5cbiAgICBpZiAoSXNSZWFkYWJsZVN0cmVhbUxvY2tlZCh0aGlzKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUaHJvdWdoIGNhbm5vdCBiZSB1c2VkIG9uIGEgbG9ja2VkIFJlYWRhYmxlU3RyZWFtJyk7XG4gICAgfVxuICAgIGlmIChJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKHRyYW5zZm9ybS53cml0YWJsZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVGhyb3VnaCBjYW5ub3QgYmUgdXNlZCBvbiBhIGxvY2tlZCBXcml0YWJsZVN0cmVhbScpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb21pc2UgPSBSZWFkYWJsZVN0cmVhbVBpcGVUbyhcbiAgICAgIHRoaXMsIHRyYW5zZm9ybS53cml0YWJsZSwgb3B0aW9ucy5wcmV2ZW50Q2xvc2UsIG9wdGlvbnMucHJldmVudEFib3J0LCBvcHRpb25zLnByZXZlbnRDYW5jZWwsIG9wdGlvbnMuc2lnbmFsXG4gICAgKTtcblxuICAgIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUocHJvbWlzZSk7XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtLnJlYWRhYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBpcGVzIHRoaXMgcmVhZGFibGUgc3RyZWFtIHRvIGEgZ2l2ZW4gd3JpdGFibGUgc3RyZWFtLiBUaGUgd2F5IGluIHdoaWNoIHRoZSBwaXBpbmcgcHJvY2VzcyBiZWhhdmVzIHVuZGVyXG4gICAqIHZhcmlvdXMgZXJyb3IgY29uZGl0aW9ucyBjYW4gYmUgY3VzdG9taXplZCB3aXRoIGEgbnVtYmVyIG9mIHBhc3NlZCBvcHRpb25zLiBJdCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzXG4gICAqIHdoZW4gdGhlIHBpcGluZyBwcm9jZXNzIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHksIG9yIHJlamVjdHMgaWYgYW55IGVycm9ycyB3ZXJlIGVuY291bnRlcmVkLlxuICAgKlxuICAgKiBQaXBpbmcgYSBzdHJlYW0gd2lsbCBsb2NrIGl0IGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIHBpcGUsIHByZXZlbnRpbmcgYW55IG90aGVyIGNvbnN1bWVyIGZyb20gYWNxdWlyaW5nIGEgcmVhZGVyLlxuICAgKi9cbiAgcGlwZVRvKGRlc3RpbmF0aW9uOiBXcml0YWJsZVN0cmVhbTxSPiwgb3B0aW9ucz86IFN0cmVhbVBpcGVPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcbiAgcGlwZVRvKGRlc3RpbmF0aW9uOiBXcml0YWJsZVN0cmVhbTxSPiB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgICAgICByYXdPcHRpb25zOiBTdHJlYW1QaXBlT3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghSXNSZWFkYWJsZVN0cmVhbSh0aGlzKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbigncGlwZVRvJykpO1xuICAgIH1cblxuICAgIGlmIChkZXN0aW5hdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlamVjdGVkV2l0aChgUGFyYW1ldGVyIDEgaXMgcmVxdWlyZWQgaW4gJ3BpcGVUbycuYCk7XG4gICAgfVxuICAgIGlmICghSXNXcml0YWJsZVN0cmVhbShkZXN0aW5hdGlvbikpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKFxuICAgICAgICBuZXcgVHlwZUVycm9yKGBSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRvJ3MgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIFdyaXRhYmxlU3RyZWFtYClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IG9wdGlvbnM6IFZhbGlkYXRlZFN0cmVhbVBpcGVPcHRpb25zO1xuICAgIHRyeSB7XG4gICAgICBvcHRpb25zID0gY29udmVydFBpcGVPcHRpb25zKHJhd09wdGlvbnMsICdTZWNvbmQgcGFyYW1ldGVyJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoZSk7XG4gICAgfVxuXG4gICAgaWYgKElzUmVhZGFibGVTdHJlYW1Mb2NrZWQodGhpcykpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKFxuICAgICAgICBuZXcgVHlwZUVycm9yKCdSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRvIGNhbm5vdCBiZSB1c2VkIG9uIGEgbG9ja2VkIFJlYWRhYmxlU3RyZWFtJylcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChJc1dyaXRhYmxlU3RyZWFtTG9ja2VkKGRlc3RpbmF0aW9uKSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgoXG4gICAgICAgIG5ldyBUeXBlRXJyb3IoJ1JlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5waXBlVG8gY2Fubm90IGJlIHVzZWQgb24gYSBsb2NrZWQgV3JpdGFibGVTdHJlYW0nKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUmVhZGFibGVTdHJlYW1QaXBlVG88Uj4oXG4gICAgICB0aGlzLCBkZXN0aW5hdGlvbiwgb3B0aW9ucy5wcmV2ZW50Q2xvc2UsIG9wdGlvbnMucHJldmVudEFib3J0LCBvcHRpb25zLnByZXZlbnRDYW5jZWwsIG9wdGlvbnMuc2lnbmFsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZWVzIHRoaXMgcmVhZGFibGUgc3RyZWFtLCByZXR1cm5pbmcgYSB0d28tZWxlbWVudCBhcnJheSBjb250YWluaW5nIHRoZSB0d28gcmVzdWx0aW5nIGJyYW5jaGVzIGFzXG4gICAqIG5ldyB7QGxpbmsgUmVhZGFibGVTdHJlYW19IGluc3RhbmNlcy5cbiAgICpcbiAgICogVGVlaW5nIGEgc3RyZWFtIHdpbGwgbG9jayBpdCwgcHJldmVudGluZyBhbnkgb3RoZXIgY29uc3VtZXIgZnJvbSBhY3F1aXJpbmcgYSByZWFkZXIuXG4gICAqIFRvIGNhbmNlbCB0aGUgc3RyZWFtLCBjYW5jZWwgYm90aCBvZiB0aGUgcmVzdWx0aW5nIGJyYW5jaGVzOyBhIGNvbXBvc2l0ZSBjYW5jZWxsYXRpb24gcmVhc29uIHdpbGwgdGhlbiBiZVxuICAgKiBwcm9wYWdhdGVkIHRvIHRoZSBzdHJlYW0ncyB1bmRlcmx5aW5nIHNvdXJjZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBjaHVua3Mgc2VlbiBpbiBlYWNoIGJyYW5jaCB3aWxsIGJlIHRoZSBzYW1lIG9iamVjdC4gSWYgdGhlIGNodW5rcyBhcmUgbm90IGltbXV0YWJsZSxcbiAgICogdGhpcyBjb3VsZCBhbGxvdyBpbnRlcmZlcmVuY2UgYmV0d2VlbiB0aGUgdHdvIGJyYW5jaGVzLlxuICAgKi9cbiAgdGVlKCk6IFtSZWFkYWJsZVN0cmVhbTxSPiwgUmVhZGFibGVTdHJlYW08Uj5dIHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ3RlZScpO1xuICAgIH1cblxuICAgIGNvbnN0IGJyYW5jaGVzID0gUmVhZGFibGVTdHJlYW1UZWUodGhpcywgZmFsc2UpO1xuICAgIHJldHVybiBDcmVhdGVBcnJheUZyb21MaXN0KGJyYW5jaGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3luY2hyb25vdXNseSBpdGVyYXRlcyBvdmVyIHRoZSBjaHVua3MgaW4gdGhlIHN0cmVhbSdzIGludGVybmFsIHF1ZXVlLlxuICAgKlxuICAgKiBBc3luY2hyb25vdXNseSBpdGVyYXRpbmcgb3ZlciB0aGUgc3RyZWFtIHdpbGwgbG9jayBpdCwgcHJldmVudGluZyBhbnkgb3RoZXIgY29uc3VtZXIgZnJvbSBhY3F1aXJpbmcgYSByZWFkZXIuXG4gICAqIFRoZSBsb2NrIHdpbGwgYmUgcmVsZWFzZWQgaWYgdGhlIGFzeW5jIGl0ZXJhdG9yJ3Mge0BsaW5rIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvci5yZXR1cm4gfCByZXR1cm4oKX0gbWV0aG9kXG4gICAqIGlzIGNhbGxlZCwgZS5nLiBieSBicmVha2luZyBvdXQgb2YgdGhlIGxvb3AuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIGNhbGxpbmcgdGhlIGFzeW5jIGl0ZXJhdG9yJ3Mge0BsaW5rIFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvci5yZXR1cm4gfCByZXR1cm4oKX0gbWV0aG9kIHdpbGwgYWxzb1xuICAgKiBjYW5jZWwgdGhlIHN0cmVhbS4gVG8gcHJldmVudCB0aGlzLCB1c2UgdGhlIHN0cmVhbSdzIHtAbGluayBSZWFkYWJsZVN0cmVhbS52YWx1ZXMgfCB2YWx1ZXMoKX0gbWV0aG9kLCBwYXNzaW5nXG4gICAqIGB0cnVlYCBmb3IgdGhlIGBwcmV2ZW50Q2FuY2VsYCBvcHRpb24uXG4gICAqL1xuICB2YWx1ZXMob3B0aW9ucz86IFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zKTogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+O1xuICB2YWx1ZXMocmF3T3B0aW9uczogUmVhZGFibGVTdHJlYW1JdGVyYXRvck9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkKTogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+IHtcbiAgICBpZiAoIUlzUmVhZGFibGVTdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ3ZhbHVlcycpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSBjb252ZXJ0SXRlcmF0b3JPcHRpb25zKHJhd09wdGlvbnMsICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICByZXR1cm4gQWNxdWlyZVJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPih0aGlzLCBvcHRpb25zLnByZXZlbnRDYW5jZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBSZWFkYWJsZVN0cmVhbS52YWx1ZXN9XG4gICAqL1xuICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKG9wdGlvbnM/OiBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyk6IFJlYWRhYmxlU3RyZWFtQXN5bmNJdGVyYXRvcjxSPjtcblxuICBbU3ltYm9sQXN5bmNJdGVyYXRvcl0ob3B0aW9ucz86IFJlYWRhYmxlU3RyZWFtSXRlcmF0b3JPcHRpb25zKTogUmVhZGFibGVTdHJlYW1Bc3luY0l0ZXJhdG9yPFI+IHtcbiAgICAvLyBTdHViIGltcGxlbWVudGF0aW9uLCBvdmVycmlkZGVuIGJlbG93XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgUmVhZGFibGVTdHJlYW0gd3JhcHBpbmcgdGhlIHByb3ZpZGVkIGl0ZXJhYmxlIG9yIGFzeW5jIGl0ZXJhYmxlLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGFkYXB0IHZhcmlvdXMga2luZHMgb2Ygb2JqZWN0cyBpbnRvIGEgcmVhZGFibGUgc3RyZWFtLFxuICAgKiBzdWNoIGFzIGFuIGFycmF5LCBhbiBhc3luYyBnZW5lcmF0b3IsIG9yIGEgTm9kZS5qcyByZWFkYWJsZSBzdHJlYW0uXG4gICAqL1xuICBzdGF0aWMgZnJvbTxSPihhc3luY0l0ZXJhYmxlOiBJdGVyYWJsZTxSPiB8IEFzeW5jSXRlcmFibGU8Uj4gfCBSZWFkYWJsZVN0cmVhbUxpa2U8Uj4pOiBSZWFkYWJsZVN0cmVhbTxSPiB7XG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRnJvbShhc3luY0l0ZXJhYmxlKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZWFkYWJsZVN0cmVhbSwge1xuICBmcm9tOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUsIHtcbiAgY2FuY2VsOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgZ2V0UmVhZGVyOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgcGlwZVRocm91Z2g6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBwaXBlVG86IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICB0ZWU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICB2YWx1ZXM6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBsb2NrZWQ6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5mcm9tLCAnZnJvbScpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS5jYW5jZWwsICdjYW5jZWwnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUuZ2V0UmVhZGVyLCAnZ2V0UmVhZGVyJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnBpcGVUaHJvdWdoLCAncGlwZVRocm91Z2gnKTtcbnNldEZ1bmN0aW9uTmFtZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUucGlwZVRvLCAncGlwZVRvJyk7XG5zZXRGdW5jdGlvbk5hbWUoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLnRlZSwgJ3RlZScpO1xuc2V0RnVuY3Rpb25OYW1lKFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS52YWx1ZXMsICd2YWx1ZXMnKTtcbmlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1JlYWRhYmxlU3RyZWFtJyxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGVTdHJlYW0ucHJvdG90eXBlLCBTeW1ib2xBc3luY0l0ZXJhdG9yLCB7XG4gIHZhbHVlOiBSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUudmFsdWVzLFxuICB3cml0YWJsZTogdHJ1ZSxcbiAgY29uZmlndXJhYmxlOiB0cnVlXG59KTtcblxuZXhwb3J0IHR5cGUge1xuICBSZWFkYWJsZVN0cmVhbUFzeW5jSXRlcmF0b3IsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRSZXN1bHQsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRSZXN1bHQsXG4gIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlclJlYWRPcHRpb25zLFxuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZSxcbiAgVW5kZXJseWluZ1NvdXJjZSxcbiAgVW5kZXJseWluZ1NvdXJjZVN0YXJ0Q2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2VQdWxsQ2FsbGJhY2ssXG4gIFVuZGVybHlpbmdTb3VyY2VDYW5jZWxDYWxsYmFjayxcbiAgVW5kZXJseWluZ0J5dGVTb3VyY2VTdGFydENhbGxiYWNrLFxuICBVbmRlcmx5aW5nQnl0ZVNvdXJjZVB1bGxDYWxsYmFjayxcbiAgU3RyZWFtUGlwZU9wdGlvbnMsXG4gIFJlYWRhYmxlV3JpdGFibGVQYWlyLFxuICBSZWFkYWJsZVN0cmVhbUl0ZXJhdG9yT3B0aW9ucyxcbiAgUmVhZGFibGVTdHJlYW1MaWtlLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXJMaWtlXG59O1xuXG4vLyBBYnN0cmFjdCBvcGVyYXRpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW0uXG5cbi8vIFRocm93cyBpZiBhbmQgb25seSBpZiBzdGFydEFsZ29yaXRobSB0aHJvd3MuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlUmVhZGFibGVTdHJlYW08Uj4oXG4gIHN0YXJ0QWxnb3JpdGhtOiAoKSA9PiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4sXG4gIHB1bGxBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD4sXG4gIGNhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+LFxuICBoaWdoV2F0ZXJNYXJrID0gMSxcbiAgc2l6ZUFsZ29yaXRobTogUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrPFI+ID0gKCkgPT4gMVxuKTogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+IHtcbiAgYXNzZXJ0KElzTm9uTmVnYXRpdmVOdW1iZXIoaGlnaFdhdGVyTWFyaykpO1xuXG4gIGNvbnN0IHN0cmVhbTogRGVmYXVsdFJlYWRhYmxlU3RyZWFtPFI+ID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUpO1xuICBJbml0aWFsaXplUmVhZGFibGVTdHJlYW0oc3RyZWFtKTtcblxuICBjb25zdCBjb250cm9sbGVyOiBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyPFI+ID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSk7XG4gIFNldFVwUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlcihcbiAgICBzdHJlYW0sIGNvbnRyb2xsZXIsIHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0sIGhpZ2hXYXRlck1hcmssIHNpemVBbGdvcml0aG1cbiAgKTtcblxuICByZXR1cm4gc3RyZWFtO1xufVxuXG4vLyBUaHJvd3MgaWYgYW5kIG9ubHkgaWYgc3RhcnRBbGdvcml0aG0gdGhyb3dzLlxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZVJlYWRhYmxlQnl0ZVN0cmVhbShcbiAgc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPixcbiAgcHVsbEFsZ29yaXRobTogKCkgPT4gUHJvbWlzZTx2b2lkPixcbiAgY2FuY2VsQWxnb3JpdGhtOiAocmVhc29uOiBhbnkpID0+IFByb21pc2U8dm9pZD5cbik6IFJlYWRhYmxlQnl0ZVN0cmVhbSB7XG4gIGNvbnN0IHN0cmVhbTogUmVhZGFibGVCeXRlU3RyZWFtID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZVN0cmVhbS5wcm90b3R5cGUpO1xuICBJbml0aWFsaXplUmVhZGFibGVTdHJlYW0oc3RyZWFtKTtcblxuICBjb25zdCBjb250cm9sbGVyOiBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyID0gT2JqZWN0LmNyZWF0ZShSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyLnByb3RvdHlwZSk7XG4gIFNldFVwUmVhZGFibGVCeXRlU3RyZWFtQ29udHJvbGxlcihzdHJlYW0sIGNvbnRyb2xsZXIsIHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0sIDAsIHVuZGVmaW5lZCk7XG5cbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuZnVuY3Rpb24gSW5pdGlhbGl6ZVJlYWRhYmxlU3RyZWFtKHN0cmVhbTogUmVhZGFibGVTdHJlYW0pIHtcbiAgc3RyZWFtLl9zdGF0ZSA9ICdyZWFkYWJsZSc7XG4gIHN0cmVhbS5fcmVhZGVyID0gdW5kZWZpbmVkO1xuICBzdHJlYW0uX3N0b3JlZEVycm9yID0gdW5kZWZpbmVkO1xuICBzdHJlYW0uX2Rpc3R1cmJlZCA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbSh4OiB1bmtub3duKTogeCBpcyBSZWFkYWJsZVN0cmVhbSB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXInKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB4IGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc1JlYWRhYmxlU3RyZWFtRGlzdHVyYmVkKHN0cmVhbTogUmVhZGFibGVTdHJlYW0pOiBib29sZWFuIHtcbiAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW0oc3RyZWFtKSk7XG5cbiAgcmV0dXJuIHN0cmVhbS5fZGlzdHVyYmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gSXNSZWFkYWJsZVN0cmVhbUxvY2tlZChzdHJlYW06IFJlYWRhYmxlU3RyZWFtKTogYm9vbGVhbiB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuXG4gIGlmIChzdHJlYW0uX3JlYWRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFJlYWRhYmxlU3RyZWFtIEFQSSBleHBvc2VkIGZvciBjb250cm9sbGVycy5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtQ2FuY2VsPFI+KHN0cmVhbTogUmVhZGFibGVTdHJlYW08Uj4sIHJlYXNvbjogYW55KTogUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgc3RyZWFtLl9kaXN0dXJiZWQgPSB0cnVlO1xuXG4gIGlmIChzdHJlYW0uX3N0YXRlID09PSAnY2xvc2VkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cbiAgaWYgKHN0cmVhbS5fc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgIHJldHVybiBwcm9taXNlUmVqZWN0ZWRXaXRoKHN0cmVhbS5fc3RvcmVkRXJyb3IpO1xuICB9XG5cbiAgUmVhZGFibGVTdHJlYW1DbG9zZShzdHJlYW0pO1xuXG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5fcmVhZGVyO1xuICBpZiAocmVhZGVyICE9PSB1bmRlZmluZWQgJiYgSXNSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXIocmVhZGVyKSkge1xuICAgIGNvbnN0IHJlYWRJbnRvUmVxdWVzdHMgPSByZWFkZXIuX3JlYWRJbnRvUmVxdWVzdHM7XG4gICAgcmVhZGVyLl9yZWFkSW50b1JlcXVlc3RzID0gbmV3IFNpbXBsZVF1ZXVlKCk7XG4gICAgcmVhZEludG9SZXF1ZXN0cy5mb3JFYWNoKHJlYWRJbnRvUmVxdWVzdCA9PiB7XG4gICAgICByZWFkSW50b1JlcXVlc3QuX2Nsb3NlU3RlcHModW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZUNhbmNlbFByb21pc2UgPSBzdHJlYW0uX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlcltDYW5jZWxTdGVwc10ocmVhc29uKTtcbiAgcmV0dXJuIHRyYW5zZm9ybVByb21pc2VXaXRoKHNvdXJjZUNhbmNlbFByb21pc2UsIG5vb3ApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmVhZGFibGVTdHJlYW1DbG9zZTxSPihzdHJlYW06IFJlYWRhYmxlU3RyZWFtPFI+KTogdm9pZCB7XG4gIGFzc2VydChzdHJlYW0uX3N0YXRlID09PSAncmVhZGFibGUnKTtcblxuICBzdHJlYW0uX3N0YXRlID0gJ2Nsb3NlZCc7XG5cbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLl9yZWFkZXI7XG5cbiAgaWYgKHJlYWRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZXNvbHZlKHJlYWRlcik7XG5cbiAgaWYgKElzUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyPFI+KHJlYWRlcikpIHtcbiAgICBjb25zdCByZWFkUmVxdWVzdHMgPSByZWFkZXIuX3JlYWRSZXF1ZXN0cztcbiAgICByZWFkZXIuX3JlYWRSZXF1ZXN0cyA9IG5ldyBTaW1wbGVRdWV1ZSgpO1xuICAgIHJlYWRSZXF1ZXN0cy5mb3JFYWNoKHJlYWRSZXF1ZXN0ID0+IHtcbiAgICAgIHJlYWRSZXF1ZXN0Ll9jbG9zZVN0ZXBzKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRhYmxlU3RyZWFtRXJyb3I8Uj4oc3RyZWFtOiBSZWFkYWJsZVN0cmVhbTxSPiwgZTogYW55KTogdm9pZCB7XG4gIGFzc2VydChJc1JlYWRhYmxlU3RyZWFtKHN0cmVhbSkpO1xuICBhc3NlcnQoc3RyZWFtLl9zdGF0ZSA9PT0gJ3JlYWRhYmxlJyk7XG5cbiAgc3RyZWFtLl9zdGF0ZSA9ICdlcnJvcmVkJztcbiAgc3RyZWFtLl9zdG9yZWRFcnJvciA9IGU7XG5cbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLl9yZWFkZXI7XG5cbiAgaWYgKHJlYWRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGVmYXVsdFJlYWRlckNsb3NlZFByb21pc2VSZWplY3QocmVhZGVyLCBlKTtcblxuICBpZiAoSXNSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4ocmVhZGVyKSkge1xuICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlckVycm9yUmVhZFJlcXVlc3RzKHJlYWRlciwgZSk7XG4gIH0gZWxzZSB7XG4gICAgYXNzZXJ0KElzUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyKHJlYWRlcikpO1xuICAgIFJlYWRhYmxlU3RyZWFtQllPQlJlYWRlckVycm9yUmVhZEludG9SZXF1ZXN0cyhyZWFkZXIsIGUpO1xuICB9XG59XG5cbi8vIFJlYWRlcnNcblxuZXhwb3J0IHR5cGUgUmVhZGFibGVTdHJlYW1SZWFkZXI8Uj4gPSBSZWFkYWJsZVN0cmVhbURlZmF1bHRSZWFkZXI8Uj4gfCBSZWFkYWJsZVN0cmVhbUJZT0JSZWFkZXI7XG5cbmV4cG9ydCB7XG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcixcbiAgUmVhZGFibGVTdHJlYW1CWU9CUmVhZGVyXG59O1xuXG4vLyBDb250cm9sbGVyc1xuXG5leHBvcnQge1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyLFxuICBSZWFkYWJsZVN0cmVhbUJZT0JSZXF1ZXN0LFxuICBSZWFkYWJsZUJ5dGVTdHJlYW1Db250cm9sbGVyXG59O1xuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgUmVhZGFibGVTdHJlYW0uXG5cbmZ1bmN0aW9uIHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoYFJlYWRhYmxlU3RyZWFtLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBSZWFkYWJsZVN0cmVhbWApO1xufVxuIiwgImltcG9ydCB0eXBlIHsgUXVldWluZ1N0cmF0ZWd5SW5pdCB9IGZyb20gJy4uL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgYXNzZXJ0RGljdGlvbmFyeSwgYXNzZXJ0UmVxdWlyZWRGaWVsZCwgY29udmVydFVucmVzdHJpY3RlZERvdWJsZSB9IGZyb20gJy4vYmFzaWMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFF1ZXVpbmdTdHJhdGVneUluaXQoaW5pdDogUXVldWluZ1N0cmF0ZWd5SW5pdCB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogc3RyaW5nKTogUXVldWluZ1N0cmF0ZWd5SW5pdCB7XG4gIGFzc2VydERpY3Rpb25hcnkoaW5pdCwgY29udGV4dCk7XG4gIGNvbnN0IGhpZ2hXYXRlck1hcmsgPSBpbml0Py5oaWdoV2F0ZXJNYXJrO1xuICBhc3NlcnRSZXF1aXJlZEZpZWxkKGhpZ2hXYXRlck1hcmssICdoaWdoV2F0ZXJNYXJrJywgJ1F1ZXVpbmdTdHJhdGVneUluaXQnKTtcbiAgcmV0dXJuIHtcbiAgICBoaWdoV2F0ZXJNYXJrOiBjb252ZXJ0VW5yZXN0cmljdGVkRG91YmxlKGhpZ2hXYXRlck1hcmspXG4gIH07XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneUluaXQgfSBmcm9tICcuL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50IH0gZnJvbSAnLi92YWxpZGF0b3JzL2Jhc2ljJztcbmltcG9ydCB7IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lJbml0IH0gZnJvbSAnLi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3ktaW5pdCc7XG5cbi8vIFRoZSBzaXplIGZ1bmN0aW9uIG11c3Qgbm90IGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgbm9yIGJlIGEgY29uc3RydWN0b3JcbmNvbnN0IGJ5dGVMZW5ndGhTaXplRnVuY3Rpb24gPSAoY2h1bms6IEFycmF5QnVmZmVyVmlldyk6IG51bWJlciA9PiB7XG4gIHJldHVybiBjaHVuay5ieXRlTGVuZ3RoO1xufTtcbnNldEZ1bmN0aW9uTmFtZShieXRlTGVuZ3RoU2l6ZUZ1bmN0aW9uLCAnc2l6ZScpO1xuXG4vKipcbiAqIEEgcXVldWluZyBzdHJhdGVneSB0aGF0IGNvdW50cyB0aGUgbnVtYmVyIG9mIGJ5dGVzIGluIGVhY2ggY2h1bmsuXG4gKlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5IGltcGxlbWVudHMgUXVldWluZ1N0cmF0ZWd5PEFycmF5QnVmZmVyVmlldz4ge1xuICAvKiogQGludGVybmFsICovXG4gIHJlYWRvbmx5IF9ieXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyazogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFF1ZXVpbmdTdHJhdGVneUluaXQpIHtcbiAgICBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50KG9wdGlvbnMsIDEsICdCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5Jyk7XG4gICAgb3B0aW9ucyA9IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lJbml0KG9wdGlvbnMsICdGaXJzdCBwYXJhbWV0ZXInKTtcbiAgICB0aGlzLl9ieXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyayA9IG9wdGlvbnMuaGlnaFdhdGVyTWFyaztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoaWdoIHdhdGVyIG1hcmsgcHJvdmlkZWQgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgZ2V0IGhpZ2hXYXRlck1hcmsoKTogbnVtYmVyIHtcbiAgICBpZiAoIUlzQnl0ZUxlbmd0aFF1ZXVpbmdTdHJhdGVneSh0aGlzKSkge1xuICAgICAgdGhyb3cgYnl0ZUxlbmd0aEJyYW5kQ2hlY2tFeGNlcHRpb24oJ2hpZ2hXYXRlck1hcmsnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3lIaWdoV2F0ZXJNYXJrO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lYXN1cmVzIHRoZSBzaXplIG9mIGBjaHVua2AgYnkgcmV0dXJuaW5nIHRoZSB2YWx1ZSBvZiBpdHMgYGJ5dGVMZW5ndGhgIHByb3BlcnR5LlxuICAgKi9cbiAgZ2V0IHNpemUoKTogKGNodW5rOiBBcnJheUJ1ZmZlclZpZXcpID0+IG51bWJlciB7XG4gICAgaWYgKCFJc0J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kodGhpcykpIHtcbiAgICAgIHRocm93IGJ5dGVMZW5ndGhCcmFuZENoZWNrRXhjZXB0aW9uKCdzaXplJyk7XG4gICAgfVxuICAgIHJldHVybiBieXRlTGVuZ3RoU2l6ZUZ1bmN0aW9uO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEJ5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kucHJvdG90eXBlLCB7XG4gIGhpZ2hXYXRlck1hcms6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBzaXplOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ0J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3knLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIEJ5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3kuXG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGhCcmFuZENoZWNrRXhjZXB0aW9uKG5hbWU6IHN0cmluZyk6IFR5cGVFcnJvciB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKGBCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc0J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3koeDogYW55KTogeCBpcyBCeXRlTGVuZ3RoUXVldWluZ1N0cmF0ZWd5IHtcbiAgaWYgKCF0eXBlSXNPYmplY3QoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnX2J5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3lIaWdoV2F0ZXJNYXJrJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIEJ5dGVMZW5ndGhRdWV1aW5nU3RyYXRlZ3k7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBRdWV1aW5nU3RyYXRlZ3ksIFF1ZXVpbmdTdHJhdGVneUluaXQgfSBmcm9tICcuL3F1ZXVpbmctc3RyYXRlZ3knO1xuaW1wb3J0IHsgc2V0RnVuY3Rpb25OYW1lLCB0eXBlSXNPYmplY3QgfSBmcm9tICcuL2hlbHBlcnMvbWlzY2VsbGFuZW91cyc7XG5pbXBvcnQgeyBhc3NlcnRSZXF1aXJlZEFyZ3VtZW50IH0gZnJvbSAnLi92YWxpZGF0b3JzL2Jhc2ljJztcbmltcG9ydCB7IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3lJbml0IH0gZnJvbSAnLi92YWxpZGF0b3JzL3F1ZXVpbmctc3RyYXRlZ3ktaW5pdCc7XG5cbi8vIFRoZSBzaXplIGZ1bmN0aW9uIG11c3Qgbm90IGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgbm9yIGJlIGEgY29uc3RydWN0b3JcbmNvbnN0IGNvdW50U2l6ZUZ1bmN0aW9uID0gKCk6IDEgPT4ge1xuICByZXR1cm4gMTtcbn07XG5zZXRGdW5jdGlvbk5hbWUoY291bnRTaXplRnVuY3Rpb24sICdzaXplJyk7XG5cbi8qKlxuICogQSBxdWV1aW5nIHN0cmF0ZWd5IHRoYXQgY291bnRzIHRoZSBudW1iZXIgb2YgY2h1bmtzLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291bnRRdWV1aW5nU3RyYXRlZ3kgaW1wbGVtZW50cyBRdWV1aW5nU3RyYXRlZ3k8YW55PiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcmVhZG9ubHkgX2NvdW50UXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyayE6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBRdWV1aW5nU3RyYXRlZ3lJbml0KSB7XG4gICAgYXNzZXJ0UmVxdWlyZWRBcmd1bWVudChvcHRpb25zLCAxLCAnQ291bnRRdWV1aW5nU3RyYXRlZ3knKTtcbiAgICBvcHRpb25zID0gY29udmVydFF1ZXVpbmdTdHJhdGVneUluaXQob3B0aW9ucywgJ0ZpcnN0IHBhcmFtZXRlcicpO1xuICAgIHRoaXMuX2NvdW50UXVldWluZ1N0cmF0ZWd5SGlnaFdhdGVyTWFyayA9IG9wdGlvbnMuaGlnaFdhdGVyTWFyaztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoaWdoIHdhdGVyIG1hcmsgcHJvdmlkZWQgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgZ2V0IGhpZ2hXYXRlck1hcmsoKTogbnVtYmVyIHtcbiAgICBpZiAoIUlzQ291bnRRdWV1aW5nU3RyYXRlZ3kodGhpcykpIHtcbiAgICAgIHRocm93IGNvdW50QnJhbmRDaGVja0V4Y2VwdGlvbignaGlnaFdhdGVyTWFyaycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY291bnRRdWV1aW5nU3RyYXRlZ3lIaWdoV2F0ZXJNYXJrO1xuICB9XG5cbiAgLyoqXG4gICAqIE1lYXN1cmVzIHRoZSBzaXplIG9mIGBjaHVua2AgYnkgYWx3YXlzIHJldHVybmluZyAxLlxuICAgKiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgdG90YWwgcXVldWUgc2l6ZSBpcyBhIGNvdW50IG9mIHRoZSBudW1iZXIgb2YgY2h1bmtzIGluIHRoZSBxdWV1ZS5cbiAgICovXG4gIGdldCBzaXplKCk6IChjaHVuazogYW55KSA9PiAxIHtcbiAgICBpZiAoIUlzQ291bnRRdWV1aW5nU3RyYXRlZ3kodGhpcykpIHtcbiAgICAgIHRocm93IGNvdW50QnJhbmRDaGVja0V4Y2VwdGlvbignc2l6ZScpO1xuICAgIH1cbiAgICByZXR1cm4gY291bnRTaXplRnVuY3Rpb247XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoQ291bnRRdWV1aW5nU3RyYXRlZ3kucHJvdG90eXBlLCB7XG4gIGhpZ2hXYXRlck1hcms6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBzaXplOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvdW50UXVldWluZ1N0cmF0ZWd5LnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdDb3VudFF1ZXVpbmdTdHJhdGVneScsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb25zIGZvciB0aGUgQ291bnRRdWV1aW5nU3RyYXRlZ3kuXG5cbmZ1bmN0aW9uIGNvdW50QnJhbmRDaGVja0V4Y2VwdGlvbihuYW1lOiBzdHJpbmcpOiBUeXBlRXJyb3Ige1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihgQ291bnRRdWV1aW5nU3RyYXRlZ3kucHJvdG90eXBlLiR7bmFtZX0gY2FuIG9ubHkgYmUgdXNlZCBvbiBhIENvdW50UXVldWluZ1N0cmF0ZWd5YCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBJc0NvdW50UXVldWluZ1N0cmF0ZWd5KHg6IGFueSk6IHggaXMgQ291bnRRdWV1aW5nU3RyYXRlZ3kge1xuICBpZiAoIXR5cGVJc09iamVjdCh4KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHgsICdfY291bnRRdWV1aW5nU3RyYXRlZ3lIaWdoV2F0ZXJNYXJrJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIENvdW50UXVldWluZ1N0cmF0ZWd5O1xufVxuIiwgImltcG9ydCB7IGFzc2VydERpY3Rpb25hcnksIGFzc2VydEZ1bmN0aW9uIH0gZnJvbSAnLi9iYXNpYyc7XG5pbXBvcnQgeyBwcm9taXNlQ2FsbCwgcmVmbGVjdENhbGwgfSBmcm9tICcuLi9oZWxwZXJzL3dlYmlkbCc7XG5pbXBvcnQgdHlwZSB7XG4gIFRyYW5zZm9ybWVyLFxuICBUcmFuc2Zvcm1lckNhbmNlbENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lckZsdXNoQ2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyU3RhcnRDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJUcmFuc2Zvcm1DYWxsYmFjayxcbiAgVmFsaWRhdGVkVHJhbnNmb3JtZXJcbn0gZnJvbSAnLi4vdHJhbnNmb3JtLXN0cmVhbS90cmFuc2Zvcm1lcic7XG5pbXBvcnQgeyBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlciB9IGZyb20gJy4uL3RyYW5zZm9ybS1zdHJlYW0nO1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRyYW5zZm9ybWVyPEksIE8+KG9yaWdpbmFsOiBUcmFuc2Zvcm1lcjxJLCBPPiB8IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHN0cmluZyk6IFZhbGlkYXRlZFRyYW5zZm9ybWVyPEksIE8+IHtcbiAgYXNzZXJ0RGljdGlvbmFyeShvcmlnaW5hbCwgY29udGV4dCk7XG4gIGNvbnN0IGNhbmNlbCA9IG9yaWdpbmFsPy5jYW5jZWw7XG4gIGNvbnN0IGZsdXNoID0gb3JpZ2luYWw/LmZsdXNoO1xuICBjb25zdCByZWFkYWJsZVR5cGUgPSBvcmlnaW5hbD8ucmVhZGFibGVUeXBlO1xuICBjb25zdCBzdGFydCA9IG9yaWdpbmFsPy5zdGFydDtcbiAgY29uc3QgdHJhbnNmb3JtID0gb3JpZ2luYWw/LnRyYW5zZm9ybTtcbiAgY29uc3Qgd3JpdGFibGVUeXBlID0gb3JpZ2luYWw/LndyaXRhYmxlVHlwZTtcbiAgcmV0dXJuIHtcbiAgICBjYW5jZWw6IGNhbmNlbCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VHJhbnNmb3JtZXJDYW5jZWxDYWxsYmFjayhjYW5jZWwsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnY2FuY2VsJyB0aGF0YCksXG4gICAgZmx1c2g6IGZsdXNoID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRUcmFuc2Zvcm1lckZsdXNoQ2FsbGJhY2soZmx1c2gsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnZmx1c2gnIHRoYXRgKSxcbiAgICByZWFkYWJsZVR5cGUsXG4gICAgc3RhcnQ6IHN0YXJ0ID09PSB1bmRlZmluZWQgP1xuICAgICAgdW5kZWZpbmVkIDpcbiAgICAgIGNvbnZlcnRUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2soc3RhcnQsIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAnc3RhcnQnIHRoYXRgKSxcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybSA9PT0gdW5kZWZpbmVkID9cbiAgICAgIHVuZGVmaW5lZCA6XG4gICAgICBjb252ZXJ0VHJhbnNmb3JtZXJUcmFuc2Zvcm1DYWxsYmFjayh0cmFuc2Zvcm0sIG9yaWdpbmFsISwgYCR7Y29udGV4dH0gaGFzIG1lbWJlciAndHJhbnNmb3JtJyB0aGF0YCksXG4gICAgd3JpdGFibGVUeXBlXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUcmFuc2Zvcm1lckZsdXNoQ2FsbGJhY2s8SSwgTz4oXG4gIGZuOiBUcmFuc2Zvcm1lckZsdXNoQ2FsbGJhY2s8Tz4sXG4gIG9yaWdpbmFsOiBUcmFuc2Zvcm1lcjxJLCBPPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiAoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4pID0+IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnRGdW5jdGlvbihmbiwgY29udGV4dCk7XG4gIHJldHVybiAoY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4pID0+IHByb21pc2VDYWxsKGZuLCBvcmlnaW5hbCwgW2NvbnRyb2xsZXJdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFRyYW5zZm9ybWVyU3RhcnRDYWxsYmFjazxJLCBPPihcbiAgZm46IFRyYW5zZm9ybWVyU3RhcnRDYWxsYmFjazxPPixcbiAgb3JpZ2luYWw6IFRyYW5zZm9ybWVyPEksIE8+LFxuICBjb250ZXh0OiBzdHJpbmdcbik6IFRyYW5zZm9ybWVyU3RhcnRDYWxsYmFjazxPPiB7XG4gIGFzc2VydEZ1bmN0aW9uKGZuLCBjb250ZXh0KTtcbiAgcmV0dXJuIChjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPikgPT4gcmVmbGVjdENhbGwoZm4sIG9yaWdpbmFsLCBbY29udHJvbGxlcl0pO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VHJhbnNmb3JtZXJUcmFuc2Zvcm1DYWxsYmFjazxJLCBPPihcbiAgZm46IFRyYW5zZm9ybWVyVHJhbnNmb3JtQ2FsbGJhY2s8SSwgTz4sXG4gIG9yaWdpbmFsOiBUcmFuc2Zvcm1lcjxJLCBPPixcbiAgY29udGV4dDogc3RyaW5nXG4pOiAoY2h1bms6IEksIGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKGNodW5rOiBJLCBjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPikgPT4gcHJvbWlzZUNhbGwoZm4sIG9yaWdpbmFsLCBbY2h1bmssIGNvbnRyb2xsZXJdKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFRyYW5zZm9ybWVyQ2FuY2VsQ2FsbGJhY2s8SSwgTz4oXG4gIGZuOiBUcmFuc2Zvcm1lckNhbmNlbENhbGxiYWNrLFxuICBvcmlnaW5hbDogVHJhbnNmb3JtZXI8SSwgTz4sXG4gIGNvbnRleHQ6IHN0cmluZ1xuKTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+IHtcbiAgYXNzZXJ0RnVuY3Rpb24oZm4sIGNvbnRleHQpO1xuICByZXR1cm4gKHJlYXNvbjogYW55KSA9PiBwcm9taXNlQ2FsbChmbiwgb3JpZ2luYWwsIFtyZWFzb25dKTtcbn1cbiIsICJpbXBvcnQgYXNzZXJ0IGZyb20gJy4uL3N0dWIvYXNzZXJ0JztcbmltcG9ydCB7XG4gIG5ld1Byb21pc2UsXG4gIHByb21pc2VSZWplY3RlZFdpdGgsXG4gIHByb21pc2VSZXNvbHZlZFdpdGgsXG4gIHNldFByb21pc2VJc0hhbmRsZWRUb1RydWUsXG4gIHRyYW5zZm9ybVByb21pc2VXaXRoLFxuICB1cG9uUHJvbWlzZVxufSBmcm9tICcuL2hlbHBlcnMvd2ViaWRsJztcbmltcG9ydCB7IENyZWF0ZVJlYWRhYmxlU3RyZWFtLCB0eXBlIERlZmF1bHRSZWFkYWJsZVN0cmVhbSwgUmVhZGFibGVTdHJlYW0gfSBmcm9tICcuL3JlYWRhYmxlLXN0cmVhbSc7XG5pbXBvcnQge1xuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2FuQ2xvc2VPckVucXVldWUsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZSxcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUsXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcixcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckdldERlc2lyZWRTaXplLFxuICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVySGFzQmFja3ByZXNzdXJlXG59IGZyb20gJy4vcmVhZGFibGUtc3RyZWFtL2RlZmF1bHQtY29udHJvbGxlcic7XG5pbXBvcnQgdHlwZSB7IFF1ZXVpbmdTdHJhdGVneSwgUXVldWluZ1N0cmF0ZWd5U2l6ZUNhbGxiYWNrIH0gZnJvbSAnLi9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB7IENyZWF0ZVdyaXRhYmxlU3RyZWFtLCBXcml0YWJsZVN0cmVhbSwgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQgfSBmcm9tICcuL3dyaXRhYmxlLXN0cmVhbSc7XG5pbXBvcnQgeyBzZXRGdW5jdGlvbk5hbWUsIHR5cGVJc09iamVjdCB9IGZyb20gJy4vaGVscGVycy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IElzTm9uTmVnYXRpdmVOdW1iZXIgfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9taXNjZWxsYW5lb3VzJztcbmltcG9ydCB7IGNvbnZlcnRRdWV1aW5nU3RyYXRlZ3kgfSBmcm9tICcuL3ZhbGlkYXRvcnMvcXVldWluZy1zdHJhdGVneSc7XG5pbXBvcnQgeyBFeHRyYWN0SGlnaFdhdGVyTWFyaywgRXh0cmFjdFNpemVBbGdvcml0aG0gfSBmcm9tICcuL2Fic3RyYWN0LW9wcy9xdWV1aW5nLXN0cmF0ZWd5JztcbmltcG9ydCB0eXBlIHtcbiAgVHJhbnNmb3JtZXIsXG4gIFRyYW5zZm9ybWVyQ2FuY2VsQ2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyRmx1c2hDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJTdGFydENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lclRyYW5zZm9ybUNhbGxiYWNrLFxuICBWYWxpZGF0ZWRUcmFuc2Zvcm1lclxufSBmcm9tICcuL3RyYW5zZm9ybS1zdHJlYW0vdHJhbnNmb3JtZXInO1xuaW1wb3J0IHsgY29udmVydFRyYW5zZm9ybWVyIH0gZnJvbSAnLi92YWxpZGF0b3JzL3RyYW5zZm9ybWVyJztcblxuLy8gQ2xhc3MgVHJhbnNmb3JtU3RyZWFtXG5cbi8qKlxuICogQSB0cmFuc2Zvcm0gc3RyZWFtIGNvbnNpc3RzIG9mIGEgcGFpciBvZiBzdHJlYW1zOiBhIHtAbGluayBXcml0YWJsZVN0cmVhbSB8IHdyaXRhYmxlIHN0cmVhbX0sXG4gKiBrbm93biBhcyBpdHMgd3JpdGFibGUgc2lkZSwgYW5kIGEge0BsaW5rIFJlYWRhYmxlU3RyZWFtIHwgcmVhZGFibGUgc3RyZWFtfSwga25vd24gYXMgaXRzIHJlYWRhYmxlIHNpZGUuXG4gKiBJbiBhIG1hbm5lciBzcGVjaWZpYyB0byB0aGUgdHJhbnNmb3JtIHN0cmVhbSBpbiBxdWVzdGlvbiwgd3JpdGVzIHRvIHRoZSB3cml0YWJsZSBzaWRlIHJlc3VsdCBpbiBuZXcgZGF0YSBiZWluZ1xuICogbWFkZSBhdmFpbGFibGUgZm9yIHJlYWRpbmcgZnJvbSB0aGUgcmVhZGFibGUgc2lkZS5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TdHJlYW08SSA9IGFueSwgTyA9IGFueT4ge1xuICAvKiogQGludGVybmFsICovXG4gIF93cml0YWJsZSE6IFdyaXRhYmxlU3RyZWFtPEk+O1xuICAvKiogQGludGVybmFsICovXG4gIF9yZWFkYWJsZSE6IERlZmF1bHRSZWFkYWJsZVN0cmVhbTxPPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYmFja3ByZXNzdXJlITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSE6IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2VfcmVzb2x2ZSE6ICgpID0+IHZvaWQ7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIhOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0cmFuc2Zvcm1lcj86IFRyYW5zZm9ybWVyPEksIE8+LFxuICAgIHdyaXRhYmxlU3RyYXRlZ3k/OiBRdWV1aW5nU3RyYXRlZ3k8ST4sXG4gICAgcmVhZGFibGVTdHJhdGVneT86IFF1ZXVpbmdTdHJhdGVneTxPPlxuICApO1xuICBjb25zdHJ1Y3RvcihyYXdUcmFuc2Zvcm1lcjogVHJhbnNmb3JtZXI8SSwgTz4gfCBudWxsIHwgdW5kZWZpbmVkID0ge30sXG4gICAgICAgICAgICAgIHJhd1dyaXRhYmxlU3RyYXRlZ3k6IFF1ZXVpbmdTdHJhdGVneTxJPiB8IG51bGwgfCB1bmRlZmluZWQgPSB7fSxcbiAgICAgICAgICAgICAgcmF3UmVhZGFibGVTdHJhdGVneTogUXVldWluZ1N0cmF0ZWd5PE8+IHwgbnVsbCB8IHVuZGVmaW5lZCA9IHt9KSB7XG4gICAgaWYgKHJhd1RyYW5zZm9ybWVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJhd1RyYW5zZm9ybWVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB3cml0YWJsZVN0cmF0ZWd5ID0gY29udmVydFF1ZXVpbmdTdHJhdGVneShyYXdXcml0YWJsZVN0cmF0ZWd5LCAnU2Vjb25kIHBhcmFtZXRlcicpO1xuICAgIGNvbnN0IHJlYWRhYmxlU3RyYXRlZ3kgPSBjb252ZXJ0UXVldWluZ1N0cmF0ZWd5KHJhd1JlYWRhYmxlU3RyYXRlZ3ksICdUaGlyZCBwYXJhbWV0ZXInKTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gY29udmVydFRyYW5zZm9ybWVyKHJhd1RyYW5zZm9ybWVyLCAnRmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgaWYgKHRyYW5zZm9ybWVyLnJlYWRhYmxlVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCByZWFkYWJsZVR5cGUgc3BlY2lmaWVkJyk7XG4gICAgfVxuICAgIGlmICh0cmFuc2Zvcm1lci53cml0YWJsZVR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgd3JpdGFibGVUeXBlIHNwZWNpZmllZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWRhYmxlSGlnaFdhdGVyTWFyayA9IEV4dHJhY3RIaWdoV2F0ZXJNYXJrKHJlYWRhYmxlU3RyYXRlZ3ksIDApO1xuICAgIGNvbnN0IHJlYWRhYmxlU2l6ZUFsZ29yaXRobSA9IEV4dHJhY3RTaXplQWxnb3JpdGhtKHJlYWRhYmxlU3RyYXRlZ3kpO1xuICAgIGNvbnN0IHdyaXRhYmxlSGlnaFdhdGVyTWFyayA9IEV4dHJhY3RIaWdoV2F0ZXJNYXJrKHdyaXRhYmxlU3RyYXRlZ3ksIDEpO1xuICAgIGNvbnN0IHdyaXRhYmxlU2l6ZUFsZ29yaXRobSA9IEV4dHJhY3RTaXplQWxnb3JpdGhtKHdyaXRhYmxlU3RyYXRlZ3kpO1xuXG4gICAgbGV0IHN0YXJ0UHJvbWlzZV9yZXNvbHZlITogKHZhbHVlOiB2b2lkIHwgUHJvbWlzZUxpa2U8dm9pZD4pID0+IHZvaWQ7XG4gICAgY29uc3Qgc3RhcnRQcm9taXNlID0gbmV3UHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICAgIHN0YXJ0UHJvbWlzZV9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICB9KTtcblxuICAgIEluaXRpYWxpemVUcmFuc2Zvcm1TdHJlYW0oXG4gICAgICB0aGlzLCBzdGFydFByb21pc2UsIHdyaXRhYmxlSGlnaFdhdGVyTWFyaywgd3JpdGFibGVTaXplQWxnb3JpdGhtLCByZWFkYWJsZUhpZ2hXYXRlck1hcmssIHJlYWRhYmxlU2l6ZUFsZ29yaXRobVxuICAgICk7XG4gICAgU2V0VXBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckZyb21UcmFuc2Zvcm1lcih0aGlzLCB0cmFuc2Zvcm1lcik7XG5cbiAgICBpZiAodHJhbnNmb3JtZXIuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RhcnRQcm9taXNlX3Jlc29sdmUodHJhbnNmb3JtZXIuc3RhcnQodGhpcy5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydFByb21pc2VfcmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVhZGFibGUgc2lkZSBvZiB0aGUgdHJhbnNmb3JtIHN0cmVhbS5cbiAgICovXG4gIGdldCByZWFkYWJsZSgpOiBSZWFkYWJsZVN0cmVhbTxPPiB7XG4gICAgaWYgKCFJc1RyYW5zZm9ybVN0cmVhbSh0aGlzKSkge1xuICAgICAgdGhyb3cgc3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbigncmVhZGFibGUnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcmVhZGFibGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHdyaXRhYmxlIHNpZGUgb2YgdGhlIHRyYW5zZm9ybSBzdHJlYW0uXG4gICAqL1xuICBnZXQgd3JpdGFibGUoKTogV3JpdGFibGVTdHJlYW08ST4ge1xuICAgIGlmICghSXNUcmFuc2Zvcm1TdHJlYW0odGhpcykpIHtcbiAgICAgIHRocm93IHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24oJ3dyaXRhYmxlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3dyaXRhYmxlO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFRyYW5zZm9ybVN0cmVhbS5wcm90b3R5cGUsIHtcbiAgcmVhZGFibGU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICB3cml0YWJsZTogeyBlbnVtZXJhYmxlOiB0cnVlIH1cbn0pO1xuaWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFuc2Zvcm1TdHJlYW0ucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIHtcbiAgICB2YWx1ZTogJ1RyYW5zZm9ybVN0cmVhbScsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG5leHBvcnQgdHlwZSB7XG4gIFRyYW5zZm9ybWVyLFxuICBUcmFuc2Zvcm1lckNhbmNlbENhbGxiYWNrLFxuICBUcmFuc2Zvcm1lclN0YXJ0Q2FsbGJhY2ssXG4gIFRyYW5zZm9ybWVyRmx1c2hDYWxsYmFjayxcbiAgVHJhbnNmb3JtZXJUcmFuc2Zvcm1DYWxsYmFja1xufTtcblxuLy8gVHJhbnNmb3JtIFN0cmVhbSBBYnN0cmFjdCBPcGVyYXRpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVUcmFuc2Zvcm1TdHJlYW08SSwgTz4oc3RhcnRBbGdvcml0aG06ICgpID0+IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtQWxnb3JpdGhtOiAoY2h1bms6IEkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsdXNoQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGVIaWdoV2F0ZXJNYXJrID0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGVTaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8ST4gPSAoKSA9PiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkYWJsZUhpZ2hXYXRlck1hcmsgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkYWJsZVNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxPPiA9ICgpID0+IDEpIHtcbiAgYXNzZXJ0KElzTm9uTmVnYXRpdmVOdW1iZXIod3JpdGFibGVIaWdoV2F0ZXJNYXJrKSk7XG4gIGFzc2VydChJc05vbk5lZ2F0aXZlTnVtYmVyKHJlYWRhYmxlSGlnaFdhdGVyTWFyaykpO1xuXG4gIGNvbnN0IHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+ID0gT2JqZWN0LmNyZWF0ZShUcmFuc2Zvcm1TdHJlYW0ucHJvdG90eXBlKTtcblxuICBsZXQgc3RhcnRQcm9taXNlX3Jlc29sdmUhOiAodmFsdWU6IHZvaWQgfCBQcm9taXNlTGlrZTx2b2lkPikgPT4gdm9pZDtcbiAgY29uc3Qgc3RhcnRQcm9taXNlID0gbmV3UHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICBzdGFydFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIEluaXRpYWxpemVUcmFuc2Zvcm1TdHJlYW0oc3RyZWFtLCBzdGFydFByb21pc2UsIHdyaXRhYmxlSGlnaFdhdGVyTWFyaywgd3JpdGFibGVTaXplQWxnb3JpdGhtLCByZWFkYWJsZUhpZ2hXYXRlck1hcmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVTaXplQWxnb3JpdGhtKTtcblxuICBjb25zdCBjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPiA9IE9iamVjdC5jcmVhdGUoVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlKTtcblxuICBTZXRVcFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyKHN0cmVhbSwgY29udHJvbGxlciwgdHJhbnNmb3JtQWxnb3JpdGhtLCBmbHVzaEFsZ29yaXRobSwgY2FuY2VsQWxnb3JpdGhtKTtcblxuICBjb25zdCBzdGFydFJlc3VsdCA9IHN0YXJ0QWxnb3JpdGhtKCk7XG4gIHN0YXJ0UHJvbWlzZV9yZXNvbHZlKHN0YXJ0UmVzdWx0KTtcbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuZnVuY3Rpb24gSW5pdGlhbGl6ZVRyYW5zZm9ybVN0cmVhbTxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRQcm9taXNlOiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZUhpZ2hXYXRlck1hcms6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGVTaXplQWxnb3JpdGhtOiBRdWV1aW5nU3RyYXRlZ3lTaXplQ2FsbGJhY2s8ST4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlSGlnaFdhdGVyTWFyazogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkYWJsZVNpemVBbGdvcml0aG06IFF1ZXVpbmdTdHJhdGVneVNpemVDYWxsYmFjazxPPikge1xuICBmdW5jdGlvbiBzdGFydEFsZ29yaXRobSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gc3RhcnRQcm9taXNlO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGVBbGdvcml0aG0oY2h1bms6IEkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNpbmtXcml0ZUFsZ29yaXRobShzdHJlYW0sIGNodW5rKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFib3J0QWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rQWJvcnRBbGdvcml0aG0oc3RyZWFtLCByZWFzb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VBbGdvcml0aG0oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rQ2xvc2VBbGdvcml0aG0oc3RyZWFtKTtcbiAgfVxuXG4gIHN0cmVhbS5fd3JpdGFibGUgPSBDcmVhdGVXcml0YWJsZVN0cmVhbShzdGFydEFsZ29yaXRobSwgd3JpdGVBbGdvcml0aG0sIGNsb3NlQWxnb3JpdGhtLCBhYm9ydEFsZ29yaXRobSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlSGlnaFdhdGVyTWFyaywgd3JpdGFibGVTaXplQWxnb3JpdGhtKTtcblxuICBmdW5jdGlvbiBwdWxsQWxnb3JpdGhtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U291cmNlUHVsbEFsZ29yaXRobShzdHJlYW0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsQWxnb3JpdGhtKHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTb3VyY2VDYW5jZWxBbGdvcml0aG0oc3RyZWFtLCByZWFzb24pO1xuICB9XG5cbiAgc3RyZWFtLl9yZWFkYWJsZSA9IENyZWF0ZVJlYWRhYmxlU3RyZWFtKHN0YXJ0QWxnb3JpdGhtLCBwdWxsQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0sIHJlYWRhYmxlSGlnaFdhdGVyTWFyayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlU2l6ZUFsZ29yaXRobSk7XG5cbiAgLy8gVGhlIFtbYmFja3ByZXNzdXJlXV0gc2xvdCBpcyBzZXQgdG8gdW5kZWZpbmVkIHNvIHRoYXQgaXQgY2FuIGJlIGluaXRpYWxpc2VkIGJ5IFRyYW5zZm9ybVN0cmVhbVNldEJhY2twcmVzc3VyZS5cbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmUgPSB1bmRlZmluZWQhO1xuICBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2UgPSB1bmRlZmluZWQhO1xuICBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZCE7XG4gIFRyYW5zZm9ybVN0cmVhbVNldEJhY2twcmVzc3VyZShzdHJlYW0sIHRydWUpO1xuXG4gIHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlciA9IHVuZGVmaW5lZCE7XG59XG5cbmZ1bmN0aW9uIElzVHJhbnNmb3JtU3RyZWFtKHg6IHVua25vd24pOiB4IGlzIFRyYW5zZm9ybVN0cmVhbSB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ190cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFRyYW5zZm9ybVN0cmVhbTtcbn1cblxuLy8gVGhpcyBpcyBhIG5vLW9wIGlmIGJvdGggc2lkZXMgYXJlIGFscmVhZHkgZXJyb3JlZC5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbUVycm9yKHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtLCBlOiBhbnkpIHtcbiAgUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKHN0cmVhbS5fcmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgZSk7XG4gIFRyYW5zZm9ybVN0cmVhbUVycm9yV3JpdGFibGVBbmRVbmJsb2NrV3JpdGUoc3RyZWFtLCBlKTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRXJyb3JXcml0YWJsZUFuZFVuYmxvY2tXcml0ZShzdHJlYW06IFRyYW5zZm9ybVN0cmVhbSwgZTogYW55KSB7XG4gIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcik7XG4gIFdyaXRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFcnJvcklmTmVlZGVkKHN0cmVhbS5fd3JpdGFibGUuX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciwgZSk7XG4gIFRyYW5zZm9ybVN0cmVhbVVuYmxvY2tXcml0ZShzdHJlYW0pO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1VbmJsb2NrV3JpdGUoc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW0pIHtcbiAgaWYgKHN0cmVhbS5fYmFja3ByZXNzdXJlKSB7XG4gICAgLy8gUHJldGVuZCB0aGF0IHB1bGwoKSB3YXMgY2FsbGVkIHRvIHBlcm1pdCBhbnkgcGVuZGluZyB3cml0ZSgpIGNhbGxzIHRvIGNvbXBsZXRlLiBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoKVxuICAgIC8vIGNhbm5vdCBiZSBjYWxsZWQgZnJvbSBlbnF1ZXVlKCkgb3IgcHVsbCgpIG9uY2UgdGhlIFJlYWRhYmxlU3RyZWFtIGlzIGVycm9yZWQsIHNvIHRoaXMgd2lsbCB3aWxsIGJlIHRoZSBmaW5hbCB0aW1lXG4gICAgLy8gX2JhY2twcmVzc3VyZSBpcyBzZXQuXG4gICAgVHJhbnNmb3JtU3RyZWFtU2V0QmFja3ByZXNzdXJlKHN0cmVhbSwgZmFsc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbVNldEJhY2twcmVzc3VyZShzdHJlYW06IFRyYW5zZm9ybVN0cmVhbSwgYmFja3ByZXNzdXJlOiBib29sZWFuKSB7XG4gIC8vIFBhc3NlcyBhbHNvIHdoZW4gY2FsbGVkIGR1cmluZyBjb25zdHJ1Y3Rpb24uXG4gIGFzc2VydChzdHJlYW0uX2JhY2twcmVzc3VyZSAhPT0gYmFja3ByZXNzdXJlKTtcblxuICBpZiAoc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2VfcmVzb2x2ZSgpO1xuICB9XG5cbiAgc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlID0gbmV3UHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBzdHJlYW0uX2JhY2twcmVzc3VyZUNoYW5nZVByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gIH0pO1xuXG4gIHN0cmVhbS5fYmFja3ByZXNzdXJlID0gYmFja3ByZXNzdXJlO1xufVxuXG4vLyBDbGFzcyBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlclxuXG4vKipcbiAqIEFsbG93cyBjb250cm9sIG9mIHRoZSB7QGxpbmsgUmVhZGFibGVTdHJlYW19IGFuZCB7QGxpbmsgV3JpdGFibGVTdHJlYW19IG9mIHRoZSBhc3NvY2lhdGVkIHtAbGluayBUcmFuc2Zvcm1TdHJlYW19LlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPGFueSwgTz47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2ZpbmlzaFByb21pc2U6IFByb21pc2U8dW5kZWZpbmVkPiB8IHVuZGVmaW5lZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZmluaXNoUHJvbWlzZV9yZXNvbHZlPzogKHZhbHVlPzogdW5kZWZpbmVkKSA9PiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9maW5pc2hQcm9taXNlX3JlamVjdD86IChyZWFzb246IGFueSkgPT4gdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdHJhbnNmb3JtQWxnb3JpdGhtOiAoY2h1bms6IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZmx1c2hBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NhbmNlbEFsZ29yaXRobTogKHJlYXNvbjogYW55KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSWxsZWdhbCBjb25zdHJ1Y3RvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRlc2lyZWQgc2l6ZSB0byBmaWxsIHRoZSByZWFkYWJsZSBzaWRl4oCZcyBpbnRlcm5hbCBxdWV1ZS4gSXQgY2FuIGJlIG5lZ2F0aXZlLCBpZiB0aGUgcXVldWUgaXMgb3Zlci1mdWxsLlxuICAgKi9cbiAgZ2V0IGRlc2lyZWRTaXplKCk6IG51bWJlciB8IG51bGwge1xuICAgIGlmICghSXNUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdkZXNpcmVkU2l6ZScpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWRhYmxlQ29udHJvbGxlciA9IHRoaXMuX2NvbnRyb2xsZWRUcmFuc2Zvcm1TdHJlYW0uX3JlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI7XG4gICAgcmV0dXJuIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJHZXREZXNpcmVkU2l6ZShyZWFkYWJsZUNvbnRyb2xsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVucXVldWVzIHRoZSBnaXZlbiBjaHVuayBgY2h1bmtgIGluIHRoZSByZWFkYWJsZSBzaWRlIG9mIHRoZSBjb250cm9sbGVkIHRyYW5zZm9ybSBzdHJlYW0uXG4gICAqL1xuICBlbnF1ZXVlKGNodW5rOiBPKTogdm9pZDtcbiAgZW5xdWV1ZShjaHVuazogTyA9IHVuZGVmaW5lZCEpOiB2b2lkIHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbignZW5xdWV1ZScpO1xuICAgIH1cblxuICAgIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZSh0aGlzLCBjaHVuayk7XG4gIH1cblxuICAvKipcbiAgICogRXJyb3JzIGJvdGggdGhlIHJlYWRhYmxlIHNpZGUgYW5kIHRoZSB3cml0YWJsZSBzaWRlIG9mIHRoZSBjb250cm9sbGVkIHRyYW5zZm9ybSBzdHJlYW0sIG1ha2luZyBhbGwgZnV0dXJlXG4gICAqIGludGVyYWN0aW9ucyB3aXRoIGl0IGZhaWwgd2l0aCB0aGUgZ2l2ZW4gZXJyb3IgYGVgLiBBbnkgY2h1bmtzIHF1ZXVlZCBmb3IgdHJhbnNmb3JtYXRpb24gd2lsbCBiZSBkaXNjYXJkZWQuXG4gICAqL1xuICBlcnJvcihyZWFzb246IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGlmICghSXNUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcih0aGlzKSkge1xuICAgICAgdGhyb3cgZGVmYXVsdENvbnRyb2xsZXJCcmFuZENoZWNrRXhjZXB0aW9uKCdlcnJvcicpO1xuICAgIH1cblxuICAgIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IodGhpcywgcmVhc29uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIHJlYWRhYmxlIHNpZGUgYW5kIGVycm9ycyB0aGUgd3JpdGFibGUgc2lkZSBvZiB0aGUgY29udHJvbGxlZCB0cmFuc2Zvcm0gc3RyZWFtLiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHRoZVxuICAgKiB0cmFuc2Zvcm1lciBvbmx5IG5lZWRzIHRvIGNvbnN1bWUgYSBwb3J0aW9uIG9mIHRoZSBjaHVua3Mgd3JpdHRlbiB0byB0aGUgd3JpdGFibGUgc2lkZS5cbiAgICovXG4gIHRlcm1pbmF0ZSgpOiB2b2lkIHtcbiAgICBpZiAoIUlzVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIodGhpcykpIHtcbiAgICAgIHRocm93IGRlZmF1bHRDb250cm9sbGVyQnJhbmRDaGVja0V4Y2VwdGlvbigndGVybWluYXRlJyk7XG4gICAgfVxuXG4gICAgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJUZXJtaW5hdGUodGhpcyk7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLCB7XG4gIGVucXVldWU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICBlcnJvcjogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIHRlcm1pbmF0ZTogeyBlbnVtZXJhYmxlOiB0cnVlIH0sXG4gIGRlc2lyZWRTaXplOiB7IGVudW1lcmFibGU6IHRydWUgfVxufSk7XG5zZXRGdW5jdGlvbk5hbWUoVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLmVucXVldWUsICdlbnF1ZXVlJyk7XG5zZXRGdW5jdGlvbk5hbWUoVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIucHJvdG90eXBlLmVycm9yLCAnZXJyb3InKTtcbnNldEZ1bmN0aW9uTmFtZShUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlci5wcm90b3R5cGUudGVybWluYXRlLCAndGVybWluYXRlJyk7XG5pZiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLCB7XG4gICAgdmFsdWU6ICdUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcicsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vLyBUcmFuc2Zvcm0gU3RyZWFtIERlZmF1bHQgQ29udHJvbGxlciBBYnN0cmFjdCBPcGVyYXRpb25zXG5cbmZ1bmN0aW9uIElzVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8TyA9IGFueT4oeDogYW55KTogeCBpcyBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPiB7XG4gIGlmICghdHlwZUlzT2JqZWN0KHgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoeCwgJ19jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtJykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4geCBpbnN0YW5jZW9mIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyO1xufVxuXG5mdW5jdGlvbiBTZXRVcFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPEksIE8+KHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtQWxnb3JpdGhtOiAoY2h1bms6IEkpID0+IFByb21pc2U8dm9pZD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsdXNoQWxnb3JpdGhtOiAoKSA9PiBQcm9taXNlPHZvaWQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPikge1xuICBhc3NlcnQoSXNUcmFuc2Zvcm1TdHJlYW0oc3RyZWFtKSk7XG4gIGFzc2VydChzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXIgPT09IHVuZGVmaW5lZCk7XG5cbiAgY29udHJvbGxlci5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbSA9IHN0cmVhbTtcbiAgc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyID0gY29udHJvbGxlcjtcblxuICBjb250cm9sbGVyLl90cmFuc2Zvcm1BbGdvcml0aG0gPSB0cmFuc2Zvcm1BbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX2ZsdXNoQWxnb3JpdGhtID0gZmx1c2hBbGdvcml0aG07XG4gIGNvbnRyb2xsZXIuX2NhbmNlbEFsZ29yaXRobSA9IGNhbmNlbEFsZ29yaXRobTtcblxuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlID0gdW5kZWZpbmVkO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBTZXRVcFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyRnJvbVRyYW5zZm9ybWVyPEksIE8+KHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1lcjogVmFsaWRhdGVkVHJhbnNmb3JtZXI8SSwgTz4pIHtcbiAgY29uc3QgY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4gPSBPYmplY3QuY3JlYXRlKFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZSk7XG5cbiAgbGV0IHRyYW5zZm9ybUFsZ29yaXRobTogKGNodW5rOiBJKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBsZXQgZmx1c2hBbGdvcml0aG06ICgpID0+IFByb21pc2U8dm9pZD47XG4gIGxldCBjYW5jZWxBbGdvcml0aG06IChyZWFzb246IGFueSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICBpZiAodHJhbnNmb3JtZXIudHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcbiAgICB0cmFuc2Zvcm1BbGdvcml0aG0gPSBjaHVuayA9PiB0cmFuc2Zvcm1lci50cmFuc2Zvcm0hKGNodW5rLCBjb250cm9sbGVyKTtcbiAgfSBlbHNlIHtcbiAgICB0cmFuc2Zvcm1BbGdvcml0aG0gPSBjaHVuayA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckVucXVldWUoY29udHJvbGxlciwgY2h1bmsgYXMgdW5rbm93biBhcyBPKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgICAgIH0gY2F0Y2ggKHRyYW5zZm9ybVJlc3VsdEUpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VSZWplY3RlZFdpdGgodHJhbnNmb3JtUmVzdWx0RSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0cmFuc2Zvcm1lci5mbHVzaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZmx1c2hBbGdvcml0aG0gPSAoKSA9PiB0cmFuc2Zvcm1lci5mbHVzaCEoY29udHJvbGxlcik7XG4gIH0gZWxzZSB7XG4gICAgZmx1c2hBbGdvcml0aG0gPSAoKSA9PiBwcm9taXNlUmVzb2x2ZWRXaXRoKHVuZGVmaW5lZCk7XG4gIH1cblxuICBpZiAodHJhbnNmb3JtZXIuY2FuY2VsICE9PSB1bmRlZmluZWQpIHtcbiAgICBjYW5jZWxBbGdvcml0aG0gPSByZWFzb24gPT4gdHJhbnNmb3JtZXIuY2FuY2VsIShyZWFzb24pO1xuICB9IGVsc2Uge1xuICAgIGNhbmNlbEFsZ29yaXRobSA9ICgpID0+IHByb21pc2VSZXNvbHZlZFdpdGgodW5kZWZpbmVkKTtcbiAgfVxuXG4gIFNldFVwVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXIoc3RyZWFtLCBjb250cm9sbGVyLCB0cmFuc2Zvcm1BbGdvcml0aG0sIGZsdXNoQWxnb3JpdGhtLCBjYW5jZWxBbGdvcml0aG0pO1xufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckNsZWFyQWxnb3JpdGhtcyhjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KSB7XG4gIGNvbnRyb2xsZXIuX3RyYW5zZm9ybUFsZ29yaXRobSA9IHVuZGVmaW5lZCE7XG4gIGNvbnRyb2xsZXIuX2ZsdXNoQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbiAgY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtID0gdW5kZWZpbmVkITtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlPE8+KGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+LCBjaHVuazogTykge1xuICBjb25zdCBzdHJlYW0gPSBjb250cm9sbGVyLl9jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtO1xuICBjb25zdCByZWFkYWJsZUNvbnRyb2xsZXIgPSBzdHJlYW0uX3JlYWRhYmxlLl9yZWFkYWJsZVN0cmVhbUNvbnRyb2xsZXI7XG4gIGlmICghUmVhZGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckNhbkNsb3NlT3JFbnF1ZXVlKHJlYWRhYmxlQ29udHJvbGxlcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWFkYWJsZSBzaWRlIGlzIG5vdCBpbiBhIHN0YXRlIHRoYXQgcGVybWl0cyBlbnF1ZXVlJyk7XG4gIH1cblxuICAvLyBXZSB0aHJvdHRsZSB0cmFuc2Zvcm0gaW52b2NhdGlvbnMgYmFzZWQgb24gdGhlIGJhY2twcmVzc3VyZSBvZiB0aGUgUmVhZGFibGVTdHJlYW0sIGJ1dCB3ZSBzdGlsbFxuICAvLyBhY2NlcHQgVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJFbnF1ZXVlKCkgY2FsbHMuXG5cbiAgdHJ5IHtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRW5xdWV1ZShyZWFkYWJsZUNvbnRyb2xsZXIsIGNodW5rKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIHJlYWRhYmxlU3RyYXRlZ3kuc2l6ZSgpIHRocm93cy5cbiAgICBUcmFuc2Zvcm1TdHJlYW1FcnJvcldyaXRhYmxlQW5kVW5ibG9ja1dyaXRlKHN0cmVhbSwgZSk7XG5cbiAgICB0aHJvdyBzdHJlYW0uX3JlYWRhYmxlLl9zdG9yZWRFcnJvcjtcbiAgfVxuXG4gIGNvbnN0IGJhY2twcmVzc3VyZSA9IFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJIYXNCYWNrcHJlc3N1cmUocmVhZGFibGVDb250cm9sbGVyKTtcbiAgaWYgKGJhY2twcmVzc3VyZSAhPT0gc3RyZWFtLl9iYWNrcHJlc3N1cmUpIHtcbiAgICBhc3NlcnQoYmFja3ByZXNzdXJlKTtcbiAgICBUcmFuc2Zvcm1TdHJlYW1TZXRCYWNrcHJlc3N1cmUoc3RyZWFtLCB0cnVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9yKGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4sIGU6IGFueSkge1xuICBUcmFuc2Zvcm1TdHJlYW1FcnJvcihjb250cm9sbGVyLl9jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtLCBlKTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJQZXJmb3JtVHJhbnNmb3JtPEksIE8+KGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPE8+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rOiBJKSB7XG4gIGNvbnN0IHRyYW5zZm9ybVByb21pc2UgPSBjb250cm9sbGVyLl90cmFuc2Zvcm1BbGdvcml0aG0oY2h1bmspO1xuICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgodHJhbnNmb3JtUHJvbWlzZSwgdW5kZWZpbmVkLCByID0+IHtcbiAgICBUcmFuc2Zvcm1TdHJlYW1FcnJvcihjb250cm9sbGVyLl9jb250cm9sbGVkVHJhbnNmb3JtU3RyZWFtLCByKTtcbiAgICB0aHJvdyByO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJUZXJtaW5hdGU8Tz4oY29udHJvbGxlcjogVHJhbnNmb3JtU3RyZWFtRGVmYXVsdENvbnRyb2xsZXI8Tz4pIHtcbiAgY29uc3Qgc3RyZWFtID0gY29udHJvbGxlci5fY29udHJvbGxlZFRyYW5zZm9ybVN0cmVhbTtcbiAgY29uc3QgcmVhZGFibGVDb250cm9sbGVyID0gc3RyZWFtLl9yZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyO1xuXG4gIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShyZWFkYWJsZUNvbnRyb2xsZXIpO1xuXG4gIGNvbnN0IGVycm9yID0gbmV3IFR5cGVFcnJvcignVHJhbnNmb3JtU3RyZWFtIHRlcm1pbmF0ZWQnKTtcbiAgVHJhbnNmb3JtU3RyZWFtRXJyb3JXcml0YWJsZUFuZFVuYmxvY2tXcml0ZShzdHJlYW0sIGVycm9yKTtcbn1cblxuLy8gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNpbmsgQWxnb3JpdGhtc1xuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0U2lua1dyaXRlQWxnb3JpdGhtPEksIE8+KHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtPEksIE8+LCBjaHVuazogSSk6IFByb21pc2U8dm9pZD4ge1xuICBhc3NlcnQoc3RyZWFtLl93cml0YWJsZS5fc3RhdGUgPT09ICd3cml0YWJsZScpO1xuXG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXI7XG5cbiAgaWYgKHN0cmVhbS5fYmFja3ByZXNzdXJlKSB7XG4gICAgY29uc3QgYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSA9IHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZTtcbiAgICBhc3NlcnQoYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSAhPT0gdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gdHJhbnNmb3JtUHJvbWlzZVdpdGgoYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZSwgKCkgPT4ge1xuICAgICAgY29uc3Qgd3JpdGFibGUgPSBzdHJlYW0uX3dyaXRhYmxlO1xuICAgICAgY29uc3Qgc3RhdGUgPSB3cml0YWJsZS5fc3RhdGU7XG4gICAgICBpZiAoc3RhdGUgPT09ICdlcnJvcmluZycpIHtcbiAgICAgICAgdGhyb3cgd3JpdGFibGUuX3N0b3JlZEVycm9yO1xuICAgICAgfVxuICAgICAgYXNzZXJ0KHN0YXRlID09PSAnd3JpdGFibGUnKTtcbiAgICAgIHJldHVybiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlclBlcmZvcm1UcmFuc2Zvcm08SSwgTz4oY29udHJvbGxlciwgY2h1bmspO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyUGVyZm9ybVRyYW5zZm9ybTxJLCBPPihjb250cm9sbGVyLCBjaHVuayk7XG59XG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTaW5rQWJvcnRBbGdvcml0aG08SSwgTz4oc3RyZWFtOiBUcmFuc2Zvcm1TdHJlYW08SSwgTz4sIHJlYXNvbjogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBzdHJlYW0uX3RyYW5zZm9ybVN0cmVhbUNvbnRyb2xsZXI7XG4gIGlmIChjb250cm9sbGVyLl9maW5pc2hQcm9taXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gY29udHJvbGxlci5fZmluaXNoUHJvbWlzZTtcbiAgfVxuXG4gIC8vIHN0cmVhbS5fcmVhZGFibGUgY2Fubm90IGNoYW5nZSBhZnRlciBjb25zdHJ1Y3Rpb24sIHNvIGNhY2hpbmcgaXQgYWNyb3NzIGEgY2FsbCB0byB1c2VyIGNvZGUgaXMgc2FmZS5cbiAgY29uc3QgcmVhZGFibGUgPSBzdHJlYW0uX3JlYWRhYmxlO1xuXG4gIC8vIEFzc2lnbiB0aGUgX2ZpbmlzaFByb21pc2Ugbm93IHNvIHRoYXQgaWYgX2NhbmNlbEFsZ29yaXRobSBjYWxscyByZWFkYWJsZS5jYW5jZWwoKSBpbnRlcm5hbGx5LFxuICAvLyB3ZSBkb24ndCBydW4gdGhlIF9jYW5jZWxBbGdvcml0aG0gYWdhaW4uXG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcblxuICBjb25zdCBjYW5jZWxQcm9taXNlID0gY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtKHJlYXNvbik7XG4gIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuXG4gIHVwb25Qcm9taXNlKGNhbmNlbFByb21pc2UsICgpID0+IHtcbiAgICBpZiAocmVhZGFibGUuX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCByZWFkYWJsZS5fc3RvcmVkRXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IocmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgcmVhc29uKTtcbiAgICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlc29sdmUoY29udHJvbGxlcik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LCByID0+IHtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IocmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgcik7XG4gICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVqZWN0KGNvbnRyb2xsZXIsIHIpO1xuICAgIHJldHVybiBudWxsO1xuICB9KTtcblxuICByZXR1cm4gY29udHJvbGxlci5fZmluaXNoUHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNpbmtDbG9zZUFsZ29yaXRobTxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBjb250cm9sbGVyID0gc3RyZWFtLl90cmFuc2Zvcm1TdHJlYW1Db250cm9sbGVyO1xuICBpZiAoY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2U7XG4gIH1cblxuICAvLyBzdHJlYW0uX3JlYWRhYmxlIGNhbm5vdCBjaGFuZ2UgYWZ0ZXIgY29uc3RydWN0aW9uLCBzbyBjYWNoaW5nIGl0IGFjcm9zcyBhIGNhbGwgdG8gdXNlciBjb2RlIGlzIHNhZmUuXG4gIGNvbnN0IHJlYWRhYmxlID0gc3RyZWFtLl9yZWFkYWJsZTtcblxuICAvLyBBc3NpZ24gdGhlIF9maW5pc2hQcm9taXNlIG5vdyBzbyB0aGF0IGlmIF9mbHVzaEFsZ29yaXRobSBjYWxscyByZWFkYWJsZS5jYW5jZWwoKSBpbnRlcm5hbGx5LFxuICAvLyB3ZSBkb24ndCBhbHNvIHJ1biB0aGUgX2NhbmNlbEFsZ29yaXRobS5cbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZSA9IG5ld1Byb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QgPSByZWplY3Q7XG4gIH0pO1xuXG4gIGNvbnN0IGZsdXNoUHJvbWlzZSA9IGNvbnRyb2xsZXIuX2ZsdXNoQWxnb3JpdGhtKCk7XG4gIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuXG4gIHVwb25Qcm9taXNlKGZsdXNoUHJvbWlzZSwgKCkgPT4ge1xuICAgIGlmIChyZWFkYWJsZS5fc3RhdGUgPT09ICdlcnJvcmVkJykge1xuICAgICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVqZWN0KGNvbnRyb2xsZXIsIHJlYWRhYmxlLl9zdG9yZWRFcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIFJlYWRhYmxlU3RyZWFtRGVmYXVsdENvbnRyb2xsZXJDbG9zZShyZWFkYWJsZS5fcmVhZGFibGVTdHJlYW1Db250cm9sbGVyKTtcbiAgICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlc29sdmUoY29udHJvbGxlcik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LCByID0+IHtcbiAgICBSZWFkYWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3IocmVhZGFibGUuX3JlYWRhYmxlU3RyZWFtQ29udHJvbGxlciwgcik7XG4gICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVqZWN0KGNvbnRyb2xsZXIsIHIpO1xuICAgIHJldHVybiBudWxsO1xuICB9KTtcblxuICByZXR1cm4gY29udHJvbGxlci5fZmluaXNoUHJvbWlzZTtcbn1cblxuLy8gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNvdXJjZSBBbGdvcml0aG1zXG5cbmZ1bmN0aW9uIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRTb3VyY2VQdWxsQWxnb3JpdGhtKHN0cmVhbTogVHJhbnNmb3JtU3RyZWFtKTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIEludmFyaWFudC4gRW5mb3JjZWQgYnkgdGhlIHByb21pc2VzIHJldHVybmVkIGJ5IHN0YXJ0KCkgYW5kIHB1bGwoKS5cbiAgYXNzZXJ0KHN0cmVhbS5fYmFja3ByZXNzdXJlKTtcblxuICBhc3NlcnQoc3RyZWFtLl9iYWNrcHJlc3N1cmVDaGFuZ2VQcm9taXNlICE9PSB1bmRlZmluZWQpO1xuXG4gIFRyYW5zZm9ybVN0cmVhbVNldEJhY2twcmVzc3VyZShzdHJlYW0sIGZhbHNlKTtcblxuICAvLyBQcmV2ZW50IHRoZSBuZXh0IHB1bGwoKSBjYWxsIHVudGlsIHRoZXJlIGlzIGJhY2twcmVzc3VyZS5cbiAgcmV0dXJuIHN0cmVhbS5fYmFja3ByZXNzdXJlQ2hhbmdlUHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gVHJhbnNmb3JtU3RyZWFtRGVmYXVsdFNvdXJjZUNhbmNlbEFsZ29yaXRobTxJLCBPPihzdHJlYW06IFRyYW5zZm9ybVN0cmVhbTxJLCBPPiwgcmVhc29uOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgY29udHJvbGxlciA9IHN0cmVhbS5fdHJhbnNmb3JtU3RyZWFtQ29udHJvbGxlcjtcbiAgaWYgKGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlO1xuICB9XG5cbiAgLy8gc3RyZWFtLl93cml0YWJsZSBjYW5ub3QgY2hhbmdlIGFmdGVyIGNvbnN0cnVjdGlvbiwgc28gY2FjaGluZyBpdCBhY3Jvc3MgYSBjYWxsIHRvIHVzZXIgY29kZSBpcyBzYWZlLlxuICBjb25zdCB3cml0YWJsZSA9IHN0cmVhbS5fd3JpdGFibGU7XG5cbiAgLy8gQXNzaWduIHRoZSBfZmluaXNoUHJvbWlzZSBub3cgc28gdGhhdCBpZiBfZmx1c2hBbGdvcml0aG0gY2FsbHMgd3JpdGFibGUuYWJvcnQoKSBvclxuICAvLyB3cml0YWJsZS5jYW5jZWwoKSBpbnRlcm5hbGx5LCB3ZSBkb24ndCBydW4gdGhlIF9jYW5jZWxBbGdvcml0aG0gYWdhaW4sIG9yIGFsc28gcnVuIHRoZVxuICAvLyBfZmx1c2hBbGdvcml0aG0uXG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2UgPSBuZXdQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID0gcmVqZWN0O1xuICB9KTtcblxuICBjb25zdCBjYW5jZWxQcm9taXNlID0gY29udHJvbGxlci5fY2FuY2VsQWxnb3JpdGhtKHJlYXNvbik7XG4gIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyQ2xlYXJBbGdvcml0aG1zKGNvbnRyb2xsZXIpO1xuXG4gIHVwb25Qcm9taXNlKGNhbmNlbFByb21pc2UsICgpID0+IHtcbiAgICBpZiAod3JpdGFibGUuX3N0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICAgIGRlZmF1bHRDb250cm9sbGVyRmluaXNoUHJvbWlzZVJlamVjdChjb250cm9sbGVyLCB3cml0YWJsZS5fc3RvcmVkRXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBXcml0YWJsZVN0cmVhbURlZmF1bHRDb250cm9sbGVyRXJyb3JJZk5lZWRlZCh3cml0YWJsZS5fd3JpdGFibGVTdHJlYW1Db250cm9sbGVyLCByZWFzb24pO1xuICAgICAgVHJhbnNmb3JtU3RyZWFtVW5ibG9ja1dyaXRlKHN0cmVhbSk7XG4gICAgICBkZWZhdWx0Q29udHJvbGxlckZpbmlzaFByb21pc2VSZXNvbHZlKGNvbnRyb2xsZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgciA9PiB7XG4gICAgV3JpdGFibGVTdHJlYW1EZWZhdWx0Q29udHJvbGxlckVycm9ySWZOZWVkZWQod3JpdGFibGUuX3dyaXRhYmxlU3RyZWFtQ29udHJvbGxlciwgcik7XG4gICAgVHJhbnNmb3JtU3RyZWFtVW5ibG9ja1dyaXRlKHN0cmVhbSk7XG4gICAgZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVqZWN0KGNvbnRyb2xsZXIsIHIpO1xuICAgIHJldHVybiBudWxsO1xuICB9KTtcblxuICByZXR1cm4gY29udHJvbGxlci5fZmluaXNoUHJvbWlzZTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLlxuXG5mdW5jdGlvbiBkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyLnByb3RvdHlwZS4ke25hbWV9IGNhbiBvbmx5IGJlIHVzZWQgb24gYSBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcmApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVzb2x2ZShjb250cm9sbGVyOiBUcmFuc2Zvcm1TdHJlYW1EZWZhdWx0Q29udHJvbGxlcjxhbnk+KSB7XG4gIGlmIChjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVzb2x2ZSgpO1xuICBjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3Jlc29sdmUgPSB1bmRlZmluZWQ7XG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0ID0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbnRyb2xsZXJGaW5pc2hQcm9taXNlUmVqZWN0KGNvbnRyb2xsZXI6IFRyYW5zZm9ybVN0cmVhbURlZmF1bHRDb250cm9sbGVyPGFueT4sIHJlYXNvbjogYW55KSB7XG4gIGlmIChjb250cm9sbGVyLl9maW5pc2hQcm9taXNlX3JlamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2V0UHJvbWlzZUlzSGFuZGxlZFRvVHJ1ZShjb250cm9sbGVyLl9maW5pc2hQcm9taXNlISk7XG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVqZWN0KHJlYXNvbik7XG4gIGNvbnRyb2xsZXIuX2ZpbmlzaFByb21pc2VfcmVzb2x2ZSA9IHVuZGVmaW5lZDtcbiAgY29udHJvbGxlci5fZmluaXNoUHJvbWlzZV9yZWplY3QgPSB1bmRlZmluZWQ7XG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBUcmFuc2Zvcm1TdHJlYW0uXG5cbmZ1bmN0aW9uIHN0cmVhbUJyYW5kQ2hlY2tFeGNlcHRpb24obmFtZTogc3RyaW5nKTogVHlwZUVycm9yIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXG4gICAgYFRyYW5zZm9ybVN0cmVhbS5wcm90b3R5cGUuJHtuYW1lfSBjYW4gb25seSBiZSB1c2VkIG9uIGEgVHJhbnNmb3JtU3RyZWFtYCk7XG59XG4iLCAiLyogYzggaWdub3JlIHN0YXJ0ICovXG4vLyA2NCBLaUIgKHNhbWUgc2l6ZSBjaHJvbWUgc2xpY2UgdGhlaXJzIGJsb2IgaW50byBVaW50OGFycmF5J3MpXG5jb25zdCBQT09MX1NJWkUgPSA2NTUzNlxuXG5pZiAoIWdsb2JhbFRoaXMuUmVhZGFibGVTdHJlYW0pIHtcbiAgLy8gYG5vZGU6c3RyZWFtL3dlYmAgZ290IGludHJvZHVjZWQgaW4gdjE2LjUuMCBhcyBleHBlcmltZW50YWxcbiAgLy8gYW5kIGl0J3MgcHJlZmVycmVkIG92ZXIgdGhlIHBvbHlmaWxsZWQgdmVyc2lvbi4gU28gd2UgYWxzb1xuICAvLyBzdXBwcmVzcyB0aGUgd2FybmluZyB0aGF0IGdldHMgZW1pdHRlZCBieSBOb2RlSlMgZm9yIHVzaW5nIGl0LlxuICB0cnkge1xuICAgIGNvbnN0IHByb2Nlc3MgPSByZXF1aXJlKCdub2RlOnByb2Nlc3MnKVxuICAgIGNvbnN0IHsgZW1pdFdhcm5pbmcgfSA9IHByb2Nlc3NcbiAgICB0cnkge1xuICAgICAgcHJvY2Vzcy5lbWl0V2FybmluZyA9ICgpID0+IHt9XG4gICAgICBPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHJlcXVpcmUoJ25vZGU6c3RyZWFtL3dlYicpKVxuICAgICAgcHJvY2Vzcy5lbWl0V2FybmluZyA9IGVtaXRXYXJuaW5nXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHByb2Nlc3MuZW1pdFdhcm5pbmcgPSBlbWl0V2FybmluZ1xuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gZmFsbGJhY2sgdG8gcG9seWZpbGwgaW1wbGVtZW50YXRpb25cbiAgICBPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHJlcXVpcmUoJ3dlYi1zdHJlYW1zLXBvbHlmaWxsL2Rpc3QvcG9ueWZpbGwuZXMyMDE4LmpzJykpXG4gIH1cbn1cblxudHJ5IHtcbiAgLy8gRG9uJ3QgdXNlIG5vZGU6IHByZWZpeCBmb3IgdGhpcywgcmVxdWlyZStub2RlOiBpcyBub3Qgc3VwcG9ydGVkIHVudGlsIG5vZGUgdjE0LjE0XG4gIC8vIE9ubHkgYGltcG9ydCgpYCBjYW4gdXNlIHByZWZpeCBpbiAxMi4yMCBhbmQgbGF0ZXJcbiAgY29uc3QgeyBCbG9iIH0gPSByZXF1aXJlKCdidWZmZXInKVxuICBpZiAoQmxvYiAmJiAhQmxvYi5wcm90b3R5cGUuc3RyZWFtKSB7XG4gICAgQmxvYi5wcm90b3R5cGUuc3RyZWFtID0gZnVuY3Rpb24gbmFtZSAocGFyYW1zKSB7XG4gICAgICBsZXQgcG9zaXRpb24gPSAwXG4gICAgICBjb25zdCBibG9iID0gdGhpc1xuXG4gICAgICByZXR1cm4gbmV3IFJlYWRhYmxlU3RyZWFtKHtcbiAgICAgICAgdHlwZTogJ2J5dGVzJyxcbiAgICAgICAgYXN5bmMgcHVsbCAoY3RybCkge1xuICAgICAgICAgIGNvbnN0IGNodW5rID0gYmxvYi5zbGljZShwb3NpdGlvbiwgTWF0aC5taW4oYmxvYi5zaXplLCBwb3NpdGlvbiArIFBPT0xfU0laRSkpXG4gICAgICAgICAgY29uc3QgYnVmZmVyID0gYXdhaXQgY2h1bmsuYXJyYXlCdWZmZXIoKVxuICAgICAgICAgIHBvc2l0aW9uICs9IGJ1ZmZlci5ieXRlTGVuZ3RoXG4gICAgICAgICAgY3RybC5lbnF1ZXVlKG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpXG5cbiAgICAgICAgICBpZiAocG9zaXRpb24gPT09IGJsb2Iuc2l6ZSkge1xuICAgICAgICAgICAgY3RybC5jbG9zZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufSBjYXRjaCAoZXJyb3IpIHt9XG4vKiBjOCBpZ25vcmUgZW5kICovXG4iLCAiLyohIGZldGNoLWJsb2IuIE1JVCBMaWNlbnNlLiBKaW1teSBXXHUwMEU0cnRpbmcgPGh0dHBzOi8vamltbXkud2FydGluZy5zZS9vcGVuc291cmNlPiAqL1xuXG4vLyBUT0RPIChqaW1teXdhcnRpbmcpOiBpbiB0aGUgZmVhdHVyZSB1c2UgY29uZGl0aW9uYWwgbG9hZGluZyB3aXRoIHRvcCBsZXZlbCBhd2FpdCAocmVxdWlyZXMgMTQueClcbi8vIE5vZGUgaGFzIHJlY2VudGx5IGFkZGVkIHdoYXR3ZyBzdHJlYW0gaW50byBjb3JlXG5cbmltcG9ydCAnLi9zdHJlYW1zLmNqcydcblxuLy8gNjQgS2lCIChzYW1lIHNpemUgY2hyb21lIHNsaWNlIHRoZWlycyBibG9iIGludG8gVWludDhhcnJheSdzKVxuY29uc3QgUE9PTF9TSVpFID0gNjU1MzZcblxuLyoqIEBwYXJhbSB7KEJsb2IgfCBVaW50OEFycmF5KVtdfSBwYXJ0cyAqL1xuYXN5bmMgZnVuY3Rpb24gKiB0b0l0ZXJhdG9yIChwYXJ0cywgY2xvbmUgPSB0cnVlKSB7XG4gIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xuICAgIGlmICgnc3RyZWFtJyBpbiBwYXJ0KSB7XG4gICAgICB5aWVsZCAqICgvKiogQHR5cGUge0FzeW5jSXRlcmFibGVJdGVyYXRvcjxVaW50OEFycmF5Pn0gKi8gKHBhcnQuc3RyZWFtKCkpKVxuICAgIH0gZWxzZSBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KHBhcnQpKSB7XG4gICAgICBpZiAoY2xvbmUpIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gcGFydC5ieXRlT2Zmc2V0XG4gICAgICAgIGNvbnN0IGVuZCA9IHBhcnQuYnl0ZU9mZnNldCArIHBhcnQuYnl0ZUxlbmd0aFxuICAgICAgICB3aGlsZSAocG9zaXRpb24gIT09IGVuZCkge1xuICAgICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbihlbmQgLSBwb3NpdGlvbiwgUE9PTF9TSVpFKVxuICAgICAgICAgIGNvbnN0IGNodW5rID0gcGFydC5idWZmZXIuc2xpY2UocG9zaXRpb24sIHBvc2l0aW9uICsgc2l6ZSlcbiAgICAgICAgICBwb3NpdGlvbiArPSBjaHVuay5ieXRlTGVuZ3RoXG4gICAgICAgICAgeWllbGQgbmV3IFVpbnQ4QXJyYXkoY2h1bmspXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHlpZWxkIHBhcnRcbiAgICAgIH1cbiAgICAvKiBjOCBpZ25vcmUgbmV4dCAxMCAqL1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3IgYmxvYnMgdGhhdCBoYXZlIGFycmF5QnVmZmVyIGJ1dCBubyBzdHJlYW0gbWV0aG9kIChub2RlcyBidWZmZXIuQmxvYilcbiAgICAgIGxldCBwb3NpdGlvbiA9IDAsIGIgPSAoLyoqIEB0eXBlIHtCbG9ifSAqLyAocGFydCkpXG4gICAgICB3aGlsZSAocG9zaXRpb24gIT09IGIuc2l6ZSkge1xuICAgICAgICBjb25zdCBjaHVuayA9IGIuc2xpY2UocG9zaXRpb24sIE1hdGgubWluKGIuc2l6ZSwgcG9zaXRpb24gKyBQT09MX1NJWkUpKVxuICAgICAgICBjb25zdCBidWZmZXIgPSBhd2FpdCBjaHVuay5hcnJheUJ1ZmZlcigpXG4gICAgICAgIHBvc2l0aW9uICs9IGJ1ZmZlci5ieXRlTGVuZ3RoXG4gICAgICAgIHlpZWxkIG5ldyBVaW50OEFycmF5KGJ1ZmZlcilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgX0Jsb2IgPSBjbGFzcyBCbG9iIHtcbiAgLyoqIEB0eXBlIHtBcnJheS48KEJsb2J8VWludDhBcnJheSk+fSAqL1xuICAjcGFydHMgPSBbXVxuICAjdHlwZSA9ICcnXG4gICNzaXplID0gMFxuICAjZW5kaW5ncyA9ICd0cmFuc3BhcmVudCdcblxuICAvKipcbiAgICogVGhlIEJsb2IoKSBjb25zdHJ1Y3RvciByZXR1cm5zIGEgbmV3IEJsb2Igb2JqZWN0LiBUaGUgY29udGVudFxuICAgKiBvZiB0aGUgYmxvYiBjb25zaXN0cyBvZiB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGUgdmFsdWVzIGdpdmVuXG4gICAqIGluIHRoZSBwYXJhbWV0ZXIgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gYmxvYlBhcnRzXG4gICAqIEBwYXJhbSB7eyB0eXBlPzogc3RyaW5nLCBlbmRpbmdzPzogc3RyaW5nIH19IFtvcHRpb25zXVxuICAgKi9cbiAgY29uc3RydWN0b3IgKGJsb2JQYXJ0cyA9IFtdLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIGJsb2JQYXJ0cyAhPT0gJ29iamVjdCcgfHwgYmxvYlBhcnRzID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gY29uc3RydWN0IFxcJ0Jsb2JcXCc6IFRoZSBwcm92aWRlZCB2YWx1ZSBjYW5ub3QgYmUgY29udmVydGVkIHRvIGEgc2VxdWVuY2UuJylcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGJsb2JQYXJ0c1tTeW1ib2wuaXRlcmF0b3JdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gY29uc3RydWN0IFxcJ0Jsb2JcXCc6IFRoZSBvYmplY3QgbXVzdCBoYXZlIGEgY2FsbGFibGUgQEBpdGVyYXRvciBwcm9wZXJ0eS4nKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIG9wdGlvbnMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZhaWxlZCB0byBjb25zdHJ1Y3QgXFwnQmxvYlxcJzogcGFyYW1ldGVyIDIgY2Fubm90IGNvbnZlcnQgdG8gZGljdGlvbmFyeS4nKVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zID09PSBudWxsKSBvcHRpb25zID0ge31cblxuICAgIGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKVxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBibG9iUGFydHMpIHtcbiAgICAgIGxldCBwYXJ0XG4gICAgICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGVsZW1lbnQpKSB7XG4gICAgICAgIHBhcnQgPSBuZXcgVWludDhBcnJheShlbGVtZW50LmJ1ZmZlci5zbGljZShlbGVtZW50LmJ5dGVPZmZzZXQsIGVsZW1lbnQuYnl0ZU9mZnNldCArIGVsZW1lbnQuYnl0ZUxlbmd0aCkpXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICBwYXJ0ID0gbmV3IFVpbnQ4QXJyYXkoZWxlbWVudC5zbGljZSgwKSlcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICAgICAgcGFydCA9IGVsZW1lbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnQgPSBlbmNvZGVyLmVuY29kZShgJHtlbGVtZW50fWApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuI3NpemUgKz0gQXJyYXlCdWZmZXIuaXNWaWV3KHBhcnQpID8gcGFydC5ieXRlTGVuZ3RoIDogcGFydC5zaXplXG4gICAgICB0aGlzLiNwYXJ0cy5wdXNoKHBhcnQpXG4gICAgfVxuXG4gICAgdGhpcy4jZW5kaW5ncyA9IGAke29wdGlvbnMuZW5kaW5ncyA9PT0gdW5kZWZpbmVkID8gJ3RyYW5zcGFyZW50JyA6IG9wdGlvbnMuZW5kaW5nc31gXG4gICAgY29uc3QgdHlwZSA9IG9wdGlvbnMudHlwZSA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcob3B0aW9ucy50eXBlKVxuICAgIHRoaXMuI3R5cGUgPSAvXltcXHgyMC1cXHg3RV0qJC8udGVzdCh0eXBlKSA/IHR5cGUgOiAnJ1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBCbG9iIGludGVyZmFjZSdzIHNpemUgcHJvcGVydHkgcmV0dXJucyB0aGVcbiAgICogc2l6ZSBvZiB0aGUgQmxvYiBpbiBieXRlcy5cbiAgICovXG4gIGdldCBzaXplICgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2l6ZVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIHByb3BlcnR5IG9mIGEgQmxvYiBvYmplY3QgcmV0dXJucyB0aGUgTUlNRSB0eXBlIG9mIHRoZSBmaWxlLlxuICAgKi9cbiAgZ2V0IHR5cGUgKCkge1xuICAgIHJldHVybiB0aGlzLiN0eXBlXG4gIH1cblxuICAvKipcbiAgICogVGhlIHRleHQoKSBtZXRob2QgaW4gdGhlIEJsb2IgaW50ZXJmYWNlIHJldHVybnMgYSBQcm9taXNlXG4gICAqIHRoYXQgcmVzb2x2ZXMgd2l0aCBhIHN0cmluZyBjb250YWluaW5nIHRoZSBjb250ZW50cyBvZlxuICAgKiB0aGUgYmxvYiwgaW50ZXJwcmV0ZWQgYXMgVVRGLTguXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPn1cbiAgICovXG4gIGFzeW5jIHRleHQgKCkge1xuICAgIC8vIE1vcmUgb3B0aW1pemVkIHRoYW4gdXNpbmcgdGhpcy5hcnJheUJ1ZmZlcigpXG4gICAgLy8gdGhhdCByZXF1aXJlcyB0d2ljZSBhcyBtdWNoIHJhbVxuICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKVxuICAgIGxldCBzdHIgPSAnJ1xuICAgIGZvciBhd2FpdCAoY29uc3QgcGFydCBvZiB0b0l0ZXJhdG9yKHRoaXMuI3BhcnRzLCBmYWxzZSkpIHtcbiAgICAgIHN0ciArPSBkZWNvZGVyLmRlY29kZShwYXJ0LCB7IHN0cmVhbTogdHJ1ZSB9KVxuICAgIH1cbiAgICAvLyBSZW1haW5pbmdcbiAgICBzdHIgKz0gZGVjb2Rlci5kZWNvZGUoKVxuICAgIHJldHVybiBzdHJcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYXJyYXlCdWZmZXIoKSBtZXRob2QgaW4gdGhlIEJsb2IgaW50ZXJmYWNlIHJldHVybnMgYVxuICAgKiBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGJsb2IgYXNcbiAgICogYmluYXJ5IGRhdGEgY29udGFpbmVkIGluIGFuIEFycmF5QnVmZmVyLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPEFycmF5QnVmZmVyPn1cbiAgICovXG4gIGFzeW5jIGFycmF5QnVmZmVyICgpIHtcbiAgICAvLyBFYXNpZXIgd2F5Li4uIEp1c3QgYSB1bm5lY2Vzc2FyeSBvdmVyaGVhZFxuICAgIC8vIGNvbnN0IHZpZXcgPSBuZXcgVWludDhBcnJheSh0aGlzLnNpemUpO1xuICAgIC8vIGF3YWl0IHRoaXMuc3RyZWFtKCkuZ2V0UmVhZGVyKHttb2RlOiAnYnlvYid9KS5yZWFkKHZpZXcpO1xuICAgIC8vIHJldHVybiB2aWV3LmJ1ZmZlcjtcblxuICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLnNpemUpXG4gICAgbGV0IG9mZnNldCA9IDBcbiAgICBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHRvSXRlcmF0b3IodGhpcy4jcGFydHMsIGZhbHNlKSkge1xuICAgICAgZGF0YS5zZXQoY2h1bmssIG9mZnNldClcbiAgICAgIG9mZnNldCArPSBjaHVuay5sZW5ndGhcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YS5idWZmZXJcbiAgfVxuXG4gIHN0cmVhbSAoKSB7XG4gICAgY29uc3QgaXQgPSB0b0l0ZXJhdG9yKHRoaXMuI3BhcnRzLCB0cnVlKVxuXG4gICAgcmV0dXJuIG5ldyBnbG9iYWxUaGlzLlJlYWRhYmxlU3RyZWFtKHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHR5cGU6ICdieXRlcycsXG4gICAgICBhc3luYyBwdWxsIChjdHJsKSB7XG4gICAgICAgIGNvbnN0IGNodW5rID0gYXdhaXQgaXQubmV4dCgpXG4gICAgICAgIGNodW5rLmRvbmUgPyBjdHJsLmNsb3NlKCkgOiBjdHJsLmVucXVldWUoY2h1bmsudmFsdWUpXG4gICAgICB9LFxuXG4gICAgICBhc3luYyBjYW5jZWwgKCkge1xuICAgICAgICBhd2FpdCBpdC5yZXR1cm4oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogVGhlIEJsb2IgaW50ZXJmYWNlJ3Mgc2xpY2UoKSBtZXRob2QgY3JlYXRlcyBhbmQgcmV0dXJucyBhXG4gICAqIG5ldyBCbG9iIG9iamVjdCB3aGljaCBjb250YWlucyBkYXRhIGZyb20gYSBzdWJzZXQgb2YgdGhlXG4gICAqIGJsb2Igb24gd2hpY2ggaXQncyBjYWxsZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnRdXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kXVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdXG4gICAqL1xuICBzbGljZSAoc3RhcnQgPSAwLCBlbmQgPSB0aGlzLnNpemUsIHR5cGUgPSAnJykge1xuICAgIGNvbnN0IHsgc2l6ZSB9ID0gdGhpc1xuXG4gICAgbGV0IHJlbGF0aXZlU3RhcnQgPSBzdGFydCA8IDAgPyBNYXRoLm1heChzaXplICsgc3RhcnQsIDApIDogTWF0aC5taW4oc3RhcnQsIHNpemUpXG4gICAgbGV0IHJlbGF0aXZlRW5kID0gZW5kIDwgMCA/IE1hdGgubWF4KHNpemUgKyBlbmQsIDApIDogTWF0aC5taW4oZW5kLCBzaXplKVxuXG4gICAgY29uc3Qgc3BhbiA9IE1hdGgubWF4KHJlbGF0aXZlRW5kIC0gcmVsYXRpdmVTdGFydCwgMClcbiAgICBjb25zdCBwYXJ0cyA9IHRoaXMuI3BhcnRzXG4gICAgY29uc3QgYmxvYlBhcnRzID0gW11cbiAgICBsZXQgYWRkZWQgPSAwXG5cbiAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgIC8vIGRvbid0IGFkZCB0aGUgb3ZlcmZsb3cgdG8gbmV3IGJsb2JQYXJ0c1xuICAgICAgaWYgKGFkZGVkID49IHNwYW4pIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2l6ZSA9IEFycmF5QnVmZmVyLmlzVmlldyhwYXJ0KSA/IHBhcnQuYnl0ZUxlbmd0aCA6IHBhcnQuc2l6ZVxuICAgICAgaWYgKHJlbGF0aXZlU3RhcnQgJiYgc2l6ZSA8PSByZWxhdGl2ZVN0YXJ0KSB7XG4gICAgICAgIC8vIFNraXAgdGhlIGJlZ2lubmluZyBhbmQgY2hhbmdlIHRoZSByZWxhdGl2ZVxuICAgICAgICAvLyBzdGFydCAmIGVuZCBwb3NpdGlvbiBhcyB3ZSBza2lwIHRoZSB1bndhbnRlZCBwYXJ0c1xuICAgICAgICByZWxhdGl2ZVN0YXJ0IC09IHNpemVcbiAgICAgICAgcmVsYXRpdmVFbmQgLT0gc2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNodW5rXG4gICAgICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcocGFydCkpIHtcbiAgICAgICAgICBjaHVuayA9IHBhcnQuc3ViYXJyYXkocmVsYXRpdmVTdGFydCwgTWF0aC5taW4oc2l6ZSwgcmVsYXRpdmVFbmQpKVxuICAgICAgICAgIGFkZGVkICs9IGNodW5rLmJ5dGVMZW5ndGhcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaHVuayA9IHBhcnQuc2xpY2UocmVsYXRpdmVTdGFydCwgTWF0aC5taW4oc2l6ZSwgcmVsYXRpdmVFbmQpKVxuICAgICAgICAgIGFkZGVkICs9IGNodW5rLnNpemVcbiAgICAgICAgfVxuICAgICAgICByZWxhdGl2ZUVuZCAtPSBzaXplXG4gICAgICAgIGJsb2JQYXJ0cy5wdXNoKGNodW5rKVxuICAgICAgICByZWxhdGl2ZVN0YXJ0ID0gMCAvLyBBbGwgbmV4dCBzZXF1ZW50aWFsIHBhcnRzIHNob3VsZCBzdGFydCBhdCAwXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtdLCB7IHR5cGU6IFN0cmluZyh0eXBlKS50b0xvd2VyQ2FzZSgpIH0pXG4gICAgYmxvYi4jc2l6ZSA9IHNwYW5cbiAgICBibG9iLiNwYXJ0cyA9IGJsb2JQYXJ0c1xuXG4gICAgcmV0dXJuIGJsb2JcbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSAoKSB7XG4gICAgcmV0dXJuICdCbG9iJ1xuICB9XG5cbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdIChvYmplY3QpIHtcbiAgICByZXR1cm4gKFxuICAgICAgb2JqZWN0ICYmXG4gICAgICB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgKFxuICAgICAgICB0eXBlb2Ygb2JqZWN0LnN0cmVhbSA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICB0eXBlb2Ygb2JqZWN0LmFycmF5QnVmZmVyID09PSAnZnVuY3Rpb24nXG4gICAgICApICYmXG4gICAgICAvXihCbG9ifEZpbGUpJC8udGVzdChvYmplY3RbU3ltYm9sLnRvU3RyaW5nVGFnXSlcbiAgICApXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoX0Jsb2IucHJvdG90eXBlLCB7XG4gIHNpemU6IHsgZW51bWVyYWJsZTogdHJ1ZSB9LFxuICB0eXBlOiB7IGVudW1lcmFibGU6IHRydWUgfSxcbiAgc2xpY2U6IHsgZW51bWVyYWJsZTogdHJ1ZSB9XG59KVxuXG4vKiogQHR5cGUge3R5cGVvZiBnbG9iYWxUaGlzLkJsb2J9ICovXG5leHBvcnQgY29uc3QgQmxvYiA9IF9CbG9iXG5leHBvcnQgZGVmYXVsdCBCbG9iXG4iLCAiaW1wb3J0IEJsb2IgZnJvbSAnLi9pbmRleC5qcydcblxuY29uc3QgX0ZpbGUgPSBjbGFzcyBGaWxlIGV4dGVuZHMgQmxvYiB7XG4gICNsYXN0TW9kaWZpZWQgPSAwXG4gICNuYW1lID0gJydcblxuICAvKipcbiAgICogQHBhcmFtIHsqW119IGZpbGVCaXRzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlTmFtZVxuICAgKiBAcGFyYW0ge3tsYXN0TW9kaWZpZWQ/OiBudW1iZXIsIHR5cGU/OiBzdHJpbmd9fSBvcHRpb25zXG4gICAqLy8vIEB0cy1pZ25vcmVcbiAgY29uc3RydWN0b3IgKGZpbGVCaXRzLCBmaWxlTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBGYWlsZWQgdG8gY29uc3RydWN0ICdGaWxlJzogMiBhcmd1bWVudHMgcmVxdWlyZWQsIGJ1dCBvbmx5ICR7YXJndW1lbnRzLmxlbmd0aH0gcHJlc2VudC5gKVxuICAgIH1cbiAgICBzdXBlcihmaWxlQml0cywgb3B0aW9ucylcblxuICAgIGlmIChvcHRpb25zID09PSBudWxsKSBvcHRpb25zID0ge31cblxuICAgIC8vIFNpbXVsYXRlIFdlYklETCB0eXBlIGNhc3RpbmcgZm9yIE5hTiB2YWx1ZSBpbiBsYXN0TW9kaWZpZWQgb3B0aW9uLlxuICAgIGNvbnN0IGxhc3RNb2RpZmllZCA9IG9wdGlvbnMubGFzdE1vZGlmaWVkID09PSB1bmRlZmluZWQgPyBEYXRlLm5vdygpIDogTnVtYmVyKG9wdGlvbnMubGFzdE1vZGlmaWVkKVxuICAgIGlmICghTnVtYmVyLmlzTmFOKGxhc3RNb2RpZmllZCkpIHtcbiAgICAgIHRoaXMuI2xhc3RNb2RpZmllZCA9IGxhc3RNb2RpZmllZFxuICAgIH1cblxuICAgIHRoaXMuI25hbWUgPSBTdHJpbmcoZmlsZU5hbWUpXG4gIH1cblxuICBnZXQgbmFtZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI25hbWVcbiAgfVxuXG4gIGdldCBsYXN0TW9kaWZpZWQgKCkge1xuICAgIHJldHVybiB0aGlzLiNsYXN0TW9kaWZpZWRcbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSAoKSB7XG4gICAgcmV0dXJuICdGaWxlJ1xuICB9XG5cbiAgc3RhdGljIFtTeW1ib2wuaGFzSW5zdGFuY2VdIChvYmplY3QpIHtcbiAgICByZXR1cm4gISFvYmplY3QgJiYgb2JqZWN0IGluc3RhbmNlb2YgQmxvYiAmJlxuICAgICAgL14oRmlsZSkkLy50ZXN0KG9iamVjdFtTeW1ib2wudG9TdHJpbmdUYWddKVxuICB9XG59XG5cbi8qKiBAdHlwZSB7dHlwZW9mIGdsb2JhbFRoaXMuRmlsZX0gKi8vLyBAdHMtaWdub3JlXG5leHBvcnQgY29uc3QgRmlsZSA9IF9GaWxlXG5leHBvcnQgZGVmYXVsdCBGaWxlXG4iLCAiLyohIGZvcm1kYXRhLXBvbHlmaWxsLiBNSVQgTGljZW5zZS4gSmltbXkgV1x1MDBFNHJ0aW5nIDxodHRwczovL2ppbW15LndhcnRpbmcuc2Uvb3BlbnNvdXJjZT4gKi9cblxuaW1wb3J0IEMgZnJvbSAnZmV0Y2gtYmxvYidcbmltcG9ydCBGIGZyb20gJ2ZldGNoLWJsb2IvZmlsZS5qcydcblxudmFyIHt0b1N0cmluZ1RhZzp0LGl0ZXJhdG9yOmksaGFzSW5zdGFuY2U6aH09U3ltYm9sLFxucj1NYXRoLnJhbmRvbSxcbm09J2FwcGVuZCxzZXQsZ2V0LGdldEFsbCxkZWxldGUsa2V5cyx2YWx1ZXMsZW50cmllcyxmb3JFYWNoLGNvbnN0cnVjdG9yJy5zcGxpdCgnLCcpLFxuZj0oYSxiLGMpPT4oYSs9JycsL14oQmxvYnxGaWxlKSQvLnRlc3QoYiAmJiBiW3RdKT9bKGM9YyE9PXZvaWQgMD9jKycnOmJbdF09PSdGaWxlJz9iLm5hbWU6J2Jsb2InLGEpLGIubmFtZSE9PWN8fGJbdF09PSdibG9iJz9uZXcgRihbYl0sYyxiKTpiXTpbYSxiKycnXSksXG5lPShjLGYpPT4oZj9jOmMucmVwbGFjZSgvXFxyP1xcbnxcXHIvZywnXFxyXFxuJykpLnJlcGxhY2UoL1xcbi9nLCclMEEnKS5yZXBsYWNlKC9cXHIvZywnJTBEJykucmVwbGFjZSgvXCIvZywnJTIyJyksXG54PShuLCBhLCBlKT0+e2lmKGEubGVuZ3RoPGUpe3Rocm93IG5ldyBUeXBlRXJyb3IoYEZhaWxlZCB0byBleGVjdXRlICcke259JyBvbiAnRm9ybURhdGEnOiAke2V9IGFyZ3VtZW50cyByZXF1aXJlZCwgYnV0IG9ubHkgJHthLmxlbmd0aH0gcHJlc2VudC5gKX19XG5cbmV4cG9ydCBjb25zdCBGaWxlID0gRlxuXG4vKiogQHR5cGUge3R5cGVvZiBnbG9iYWxUaGlzLkZvcm1EYXRhfSAqL1xuZXhwb3J0IGNvbnN0IEZvcm1EYXRhID0gY2xhc3MgRm9ybURhdGEge1xuI2Q9W107XG5jb25zdHJ1Y3RvciguLi5hKXtpZihhLmxlbmd0aCl0aHJvdyBuZXcgVHlwZUVycm9yKGBGYWlsZWQgdG8gY29uc3RydWN0ICdGb3JtRGF0YSc6IHBhcmFtZXRlciAxIGlzIG5vdCBvZiB0eXBlICdIVE1MRm9ybUVsZW1lbnQnLmApfVxuZ2V0IFt0XSgpIHtyZXR1cm4gJ0Zvcm1EYXRhJ31cbltpXSgpe3JldHVybiB0aGlzLmVudHJpZXMoKX1cbnN0YXRpYyBbaF0obykge3JldHVybiBvJiZ0eXBlb2Ygbz09PSdvYmplY3QnJiZvW3RdPT09J0Zvcm1EYXRhJyYmIW0uc29tZShtPT50eXBlb2Ygb1ttXSE9J2Z1bmN0aW9uJyl9XG5hcHBlbmQoLi4uYSl7eCgnYXBwZW5kJyxhcmd1bWVudHMsMik7dGhpcy4jZC5wdXNoKGYoLi4uYSkpfVxuZGVsZXRlKGEpe3goJ2RlbGV0ZScsYXJndW1lbnRzLDEpO2ErPScnO3RoaXMuI2Q9dGhpcy4jZC5maWx0ZXIoKFtiXSk9PmIhPT1hKX1cbmdldChhKXt4KCdnZXQnLGFyZ3VtZW50cywxKTthKz0nJztmb3IodmFyIGI9dGhpcy4jZCxsPWIubGVuZ3RoLGM9MDtjPGw7YysrKWlmKGJbY11bMF09PT1hKXJldHVybiBiW2NdWzFdO3JldHVybiBudWxsfVxuZ2V0QWxsKGEsYil7eCgnZ2V0QWxsJyxhcmd1bWVudHMsMSk7Yj1bXTthKz0nJzt0aGlzLiNkLmZvckVhY2goYz0+Y1swXT09PWEmJmIucHVzaChjWzFdKSk7cmV0dXJuIGJ9XG5oYXMoYSl7eCgnaGFzJyxhcmd1bWVudHMsMSk7YSs9Jyc7cmV0dXJuIHRoaXMuI2Quc29tZShiPT5iWzBdPT09YSl9XG5mb3JFYWNoKGEsYil7eCgnZm9yRWFjaCcsYXJndW1lbnRzLDEpO2Zvcih2YXIgW2MsZF1vZiB0aGlzKWEuY2FsbChiLGQsYyx0aGlzKX1cbnNldCguLi5hKXt4KCdzZXQnLGFyZ3VtZW50cywyKTt2YXIgYj1bXSxjPSEwO2E9ZiguLi5hKTt0aGlzLiNkLmZvckVhY2goZD0+e2RbMF09PT1hWzBdP2MmJihjPSFiLnB1c2goYSkpOmIucHVzaChkKX0pO2MmJmIucHVzaChhKTt0aGlzLiNkPWJ9XG4qZW50cmllcygpe3lpZWxkKnRoaXMuI2R9XG4qa2V5cygpe2Zvcih2YXJbYV1vZiB0aGlzKXlpZWxkIGF9XG4qdmFsdWVzKCl7Zm9yKHZhclssYV1vZiB0aGlzKXlpZWxkIGF9fVxuXG4vKiogQHBhcmFtIHtGb3JtRGF0YX0gRiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1EYXRhVG9CbG9iIChGLEI9Qyl7XG52YXIgYj1gJHtyKCl9JHtyKCl9YC5yZXBsYWNlKC9cXC4vZywgJycpLnNsaWNlKC0yOCkucGFkU3RhcnQoMzIsICctJyksYz1bXSxwPWAtLSR7Yn1cXHJcXG5Db250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XCJgXG5GLmZvckVhY2goKHYsbik9PnR5cGVvZiB2PT0nc3RyaW5nJ1xuP2MucHVzaChwK2UobikrYFwiXFxyXFxuXFxyXFxuJHt2LnJlcGxhY2UoL1xccig/IVxcbil8KD88IVxccilcXG4vZywgJ1xcclxcbicpfVxcclxcbmApXG46Yy5wdXNoKHArZShuKStgXCI7IGZpbGVuYW1lPVwiJHtlKHYubmFtZSwgMSl9XCJcXHJcXG5Db250ZW50LVR5cGU6ICR7di50eXBlfHxcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwifVxcclxcblxcclxcbmAsIHYsICdcXHJcXG4nKSlcbmMucHVzaChgLS0ke2J9LS1gKVxucmV0dXJuIG5ldyBCKGMse3R5cGU6XCJtdWx0aXBhcnQvZm9ybS1kYXRhOyBib3VuZGFyeT1cIitifSl9XG4iLCAiLyohIG5vZGUtZG9tZXhjZXB0aW9uLiBNSVQgTGljZW5zZS4gSmltbXkgV1x1MDBFNHJ0aW5nIDxodHRwczovL2ppbW15LndhcnRpbmcuc2Uvb3BlbnNvdXJjZT4gKi9cblxuaWYgKCFnbG9iYWxUaGlzLkRPTUV4Y2VwdGlvbikge1xuICB0cnkge1xuICAgIGNvbnN0IHsgTWVzc2FnZUNoYW5uZWwgfSA9IHJlcXVpcmUoJ3dvcmtlcl90aHJlYWRzJyksXG4gICAgcG9ydCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpLnBvcnQxLFxuICAgIGFiID0gbmV3IEFycmF5QnVmZmVyKClcbiAgICBwb3J0LnBvc3RNZXNzYWdlKGFiLCBbYWIsIGFiXSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdET01FeGNlcHRpb24nICYmIChcbiAgICAgIGdsb2JhbFRoaXMuRE9NRXhjZXB0aW9uID0gZXJyLmNvbnN0cnVjdG9yXG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsVGhpcy5ET01FeGNlcHRpb25cbiIsICJpbXBvcnQgeyBzdGF0U3luYywgY3JlYXRlUmVhZFN0cmVhbSwgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgRE9NRXhjZXB0aW9uIGZyb20gJ25vZGUtZG9tZXhjZXB0aW9uJ1xuXG5pbXBvcnQgRmlsZSBmcm9tICcuL2ZpbGUuanMnXG5pbXBvcnQgQmxvYiBmcm9tICcuL2luZGV4LmpzJ1xuXG5jb25zdCB7IHN0YXQgfSA9IGZzXG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggZmlsZXBhdGggb24gdGhlIGRpc2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gbWltZXR5cGUgdG8gdXNlXG4gKi9cbmNvbnN0IGJsb2JGcm9tU3luYyA9IChwYXRoLCB0eXBlKSA9PiBmcm9tQmxvYihzdGF0U3luYyhwYXRoKSwgcGF0aCwgdHlwZSlcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBmaWxlcGF0aCBvbiB0aGUgZGlza1xuICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXSBtaW1ldHlwZSB0byB1c2VcbiAqIEByZXR1cm5zIHtQcm9taXNlPEJsb2I+fVxuICovXG5jb25zdCBibG9iRnJvbSA9IChwYXRoLCB0eXBlKSA9PiBzdGF0KHBhdGgpLnRoZW4oc3RhdCA9PiBmcm9tQmxvYihzdGF0LCBwYXRoLCB0eXBlKSlcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBmaWxlcGF0aCBvbiB0aGUgZGlza1xuICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXSBtaW1ldHlwZSB0byB1c2VcbiAqIEByZXR1cm5zIHtQcm9taXNlPEZpbGU+fVxuICovXG5jb25zdCBmaWxlRnJvbSA9IChwYXRoLCB0eXBlKSA9PiBzdGF0KHBhdGgpLnRoZW4oc3RhdCA9PiBmcm9tRmlsZShzdGF0LCBwYXRoLCB0eXBlKSlcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBmaWxlcGF0aCBvbiB0aGUgZGlza1xuICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXSBtaW1ldHlwZSB0byB1c2VcbiAqL1xuY29uc3QgZmlsZUZyb21TeW5jID0gKHBhdGgsIHR5cGUpID0+IGZyb21GaWxlKHN0YXRTeW5jKHBhdGgpLCBwYXRoLCB0eXBlKVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBmcm9tQmxvYiA9IChzdGF0LCBwYXRoLCB0eXBlID0gJycpID0+IG5ldyBCbG9iKFtuZXcgQmxvYkRhdGFJdGVtKHtcbiAgcGF0aCxcbiAgc2l6ZTogc3RhdC5zaXplLFxuICBsYXN0TW9kaWZpZWQ6IHN0YXQubXRpbWVNcyxcbiAgc3RhcnQ6IDBcbn0pXSwgeyB0eXBlIH0pXG5cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IGZyb21GaWxlID0gKHN0YXQsIHBhdGgsIHR5cGUgPSAnJykgPT4gbmV3IEZpbGUoW25ldyBCbG9iRGF0YUl0ZW0oe1xuICBwYXRoLFxuICBzaXplOiBzdGF0LnNpemUsXG4gIGxhc3RNb2RpZmllZDogc3RhdC5tdGltZU1zLFxuICBzdGFydDogMFxufSldLCBiYXNlbmFtZShwYXRoKSwgeyB0eXBlLCBsYXN0TW9kaWZpZWQ6IHN0YXQubXRpbWVNcyB9KVxuXG4vKipcbiAqIFRoaXMgaXMgYSBibG9iIGJhY2tlZCB1cCBieSBhIGZpbGUgb24gdGhlIGRpc2tcbiAqIHdpdGggbWluaXVtIHJlcXVpcmVtZW50LiBJdHMgd3JhcHBlZCBhcm91bmQgYSBCbG9iIGFzIGEgYmxvYlBhcnRcbiAqIHNvIHlvdSBoYXZlIG5vIGRpcmVjdCBhY2Nlc3MgdG8gdGhpcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBCbG9iRGF0YUl0ZW0ge1xuICAjcGF0aFxuICAjc3RhcnRcblxuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIHRoaXMuI3BhdGggPSBvcHRpb25zLnBhdGhcbiAgICB0aGlzLiNzdGFydCA9IG9wdGlvbnMuc3RhcnRcbiAgICB0aGlzLnNpemUgPSBvcHRpb25zLnNpemVcbiAgICB0aGlzLmxhc3RNb2RpZmllZCA9IG9wdGlvbnMubGFzdE1vZGlmaWVkXG4gIH1cblxuICAvKipcbiAgICogU2xpY2luZyBhcmd1bWVudHMgaXMgZmlyc3QgdmFsaWRhdGVkIGFuZCBmb3JtYXR0ZWRcbiAgICogdG8gbm90IGJlIG91dCBvZiByYW5nZSBieSBCbG9iLnByb3RvdHlwZS5zbGljZVxuICAgKi9cbiAgc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gbmV3IEJsb2JEYXRhSXRlbSh7XG4gICAgICBwYXRoOiB0aGlzLiNwYXRoLFxuICAgICAgbGFzdE1vZGlmaWVkOiB0aGlzLmxhc3RNb2RpZmllZCxcbiAgICAgIHNpemU6IGVuZCAtIHN0YXJ0LFxuICAgICAgc3RhcnQ6IHRoaXMuI3N0YXJ0ICsgc3RhcnRcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgKiBzdHJlYW0gKCkge1xuICAgIGNvbnN0IHsgbXRpbWVNcyB9ID0gYXdhaXQgc3RhdCh0aGlzLiNwYXRoKVxuICAgIGlmIChtdGltZU1zID4gdGhpcy5sYXN0TW9kaWZpZWQpIHtcbiAgICAgIHRocm93IG5ldyBET01FeGNlcHRpb24oJ1RoZSByZXF1ZXN0ZWQgZmlsZSBjb3VsZCBub3QgYmUgcmVhZCwgdHlwaWNhbGx5IGR1ZSB0byBwZXJtaXNzaW9uIHByb2JsZW1zIHRoYXQgaGF2ZSBvY2N1cnJlZCBhZnRlciBhIHJlZmVyZW5jZSB0byBhIGZpbGUgd2FzIGFjcXVpcmVkLicsICdOb3RSZWFkYWJsZUVycm9yJylcbiAgICB9XG4gICAgeWllbGQgKiBjcmVhdGVSZWFkU3RyZWFtKHRoaXMuI3BhdGgsIHtcbiAgICAgIHN0YXJ0OiB0aGlzLiNzdGFydCxcbiAgICAgIGVuZDogdGhpcy4jc3RhcnQgKyB0aGlzLnNpemUgLSAxXG4gICAgfSlcbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSAoKSB7XG4gICAgcmV0dXJuICdCbG9iJ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJsb2JGcm9tU3luY1xuZXhwb3J0IHsgRmlsZSwgQmxvYiwgYmxvYkZyb20sIGJsb2JGcm9tU3luYywgZmlsZUZyb20sIGZpbGVGcm9tU3luYyB9XG4iLCAiaW1wb3J0IHtGaWxlfSBmcm9tICdmZXRjaC1ibG9iL2Zyb20uanMnO1xuaW1wb3J0IHtGb3JtRGF0YX0gZnJvbSAnZm9ybWRhdGEtcG9seWZpbGwvZXNtLm1pbi5qcyc7XG5cbmxldCBzID0gMDtcbmNvbnN0IFMgPSB7XG5cdFNUQVJUX0JPVU5EQVJZOiBzKyssXG5cdEhFQURFUl9GSUVMRF9TVEFSVDogcysrLFxuXHRIRUFERVJfRklFTEQ6IHMrKyxcblx0SEVBREVSX1ZBTFVFX1NUQVJUOiBzKyssXG5cdEhFQURFUl9WQUxVRTogcysrLFxuXHRIRUFERVJfVkFMVUVfQUxNT1NUX0RPTkU6IHMrKyxcblx0SEVBREVSU19BTE1PU1RfRE9ORTogcysrLFxuXHRQQVJUX0RBVEFfU1RBUlQ6IHMrKyxcblx0UEFSVF9EQVRBOiBzKyssXG5cdEVORDogcysrXG59O1xuXG5sZXQgZiA9IDE7XG5jb25zdCBGID0ge1xuXHRQQVJUX0JPVU5EQVJZOiBmLFxuXHRMQVNUX0JPVU5EQVJZOiBmICo9IDJcbn07XG5cbmNvbnN0IExGID0gMTA7XG5jb25zdCBDUiA9IDEzO1xuY29uc3QgU1BBQ0UgPSAzMjtcbmNvbnN0IEhZUEhFTiA9IDQ1O1xuY29uc3QgQ09MT04gPSA1ODtcbmNvbnN0IEEgPSA5NztcbmNvbnN0IFogPSAxMjI7XG5cbmNvbnN0IGxvd2VyID0gYyA9PiBjIHwgMHgyMDtcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5jbGFzcyBNdWx0aXBhcnRQYXJzZXIge1xuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IGJvdW5kYXJ5XG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihib3VuZGFyeSkge1xuXHRcdHRoaXMuaW5kZXggPSAwO1xuXHRcdHRoaXMuZmxhZ3MgPSAwO1xuXG5cdFx0dGhpcy5vbkhlYWRlckVuZCA9IG5vb3A7XG5cdFx0dGhpcy5vbkhlYWRlckZpZWxkID0gbm9vcDtcblx0XHR0aGlzLm9uSGVhZGVyc0VuZCA9IG5vb3A7XG5cdFx0dGhpcy5vbkhlYWRlclZhbHVlID0gbm9vcDtcblx0XHR0aGlzLm9uUGFydEJlZ2luID0gbm9vcDtcblx0XHR0aGlzLm9uUGFydERhdGEgPSBub29wO1xuXHRcdHRoaXMub25QYXJ0RW5kID0gbm9vcDtcblxuXHRcdHRoaXMuYm91bmRhcnlDaGFycyA9IHt9O1xuXG5cdFx0Ym91bmRhcnkgPSAnXFxyXFxuLS0nICsgYm91bmRhcnk7XG5cdFx0Y29uc3QgdWk4YSA9IG5ldyBVaW50OEFycmF5KGJvdW5kYXJ5Lmxlbmd0aCk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib3VuZGFyeS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dWk4YVtpXSA9IGJvdW5kYXJ5LmNoYXJDb2RlQXQoaSk7XG5cdFx0XHR0aGlzLmJvdW5kYXJ5Q2hhcnNbdWk4YVtpXV0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRoaXMuYm91bmRhcnkgPSB1aThhO1xuXHRcdHRoaXMubG9va2JlaGluZCA9IG5ldyBVaW50OEFycmF5KHRoaXMuYm91bmRhcnkubGVuZ3RoICsgOCk7XG5cdFx0dGhpcy5zdGF0ZSA9IFMuU1RBUlRfQk9VTkRBUlk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtVaW50OEFycmF5fSBkYXRhXG5cdCAqL1xuXHR3cml0ZShkYXRhKSB7XG5cdFx0bGV0IGkgPSAwO1xuXHRcdGNvbnN0IGxlbmd0aF8gPSBkYXRhLmxlbmd0aDtcblx0XHRsZXQgcHJldmlvdXNJbmRleCA9IHRoaXMuaW5kZXg7XG5cdFx0bGV0IHtsb29rYmVoaW5kLCBib3VuZGFyeSwgYm91bmRhcnlDaGFycywgaW5kZXgsIHN0YXRlLCBmbGFnc30gPSB0aGlzO1xuXHRcdGNvbnN0IGJvdW5kYXJ5TGVuZ3RoID0gdGhpcy5ib3VuZGFyeS5sZW5ndGg7XG5cdFx0Y29uc3QgYm91bmRhcnlFbmQgPSBib3VuZGFyeUxlbmd0aCAtIDE7XG5cdFx0Y29uc3QgYnVmZmVyTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cdFx0bGV0IGM7XG5cdFx0bGV0IGNsO1xuXG5cdFx0Y29uc3QgbWFyayA9IG5hbWUgPT4ge1xuXHRcdFx0dGhpc1tuYW1lICsgJ01hcmsnXSA9IGk7XG5cdFx0fTtcblxuXHRcdGNvbnN0IGNsZWFyID0gbmFtZSA9PiB7XG5cdFx0XHRkZWxldGUgdGhpc1tuYW1lICsgJ01hcmsnXTtcblx0XHR9O1xuXG5cdFx0Y29uc3QgY2FsbGJhY2sgPSAoY2FsbGJhY2tTeW1ib2wsIHN0YXJ0LCBlbmQsIHVpOGEpID0+IHtcblx0XHRcdGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0ICE9PSBlbmQpIHtcblx0XHRcdFx0dGhpc1tjYWxsYmFja1N5bWJvbF0odWk4YSAmJiB1aThhLnN1YmFycmF5KHN0YXJ0LCBlbmQpKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc3QgZGF0YUNhbGxiYWNrID0gKG5hbWUsIGNsZWFyKSA9PiB7XG5cdFx0XHRjb25zdCBtYXJrU3ltYm9sID0gbmFtZSArICdNYXJrJztcblx0XHRcdGlmICghKG1hcmtTeW1ib2wgaW4gdGhpcykpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2xlYXIpIHtcblx0XHRcdFx0Y2FsbGJhY2sobmFtZSwgdGhpc1ttYXJrU3ltYm9sXSwgaSwgZGF0YSk7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzW21hcmtTeW1ib2xdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2FsbGJhY2sobmFtZSwgdGhpc1ttYXJrU3ltYm9sXSwgZGF0YS5sZW5ndGgsIGRhdGEpO1xuXHRcdFx0XHR0aGlzW21hcmtTeW1ib2xdID0gMDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbmd0aF87IGkrKykge1xuXHRcdFx0YyA9IGRhdGFbaV07XG5cblx0XHRcdHN3aXRjaCAoc3RhdGUpIHtcblx0XHRcdFx0Y2FzZSBTLlNUQVJUX0JPVU5EQVJZOlxuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gYm91bmRhcnkubGVuZ3RoIC0gMikge1xuXHRcdFx0XHRcdFx0aWYgKGMgPT09IEhZUEhFTikge1xuXHRcdFx0XHRcdFx0XHRmbGFncyB8PSBGLkxBU1RfQk9VTkRBUlk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGMgIT09IENSKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaW5kZXggLSAxID09PSBib3VuZGFyeS5sZW5ndGggLSAyKSB7XG5cdFx0XHRcdFx0XHRpZiAoZmxhZ3MgJiBGLkxBU1RfQk9VTkRBUlkgJiYgYyA9PT0gSFlQSEVOKSB7XG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gUy5FTkQ7XG5cdFx0XHRcdFx0XHRcdGZsYWdzID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIShmbGFncyAmIEYuTEFTVF9CT1VOREFSWSkgJiYgYyA9PT0gTEYpIHtcblx0XHRcdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjaygnb25QYXJ0QmVnaW4nKTtcblx0XHRcdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUl9GSUVMRF9TVEFSVDtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGMgIT09IGJvdW5kYXJ5W2luZGV4ICsgMl0pIHtcblx0XHRcdFx0XHRcdGluZGV4ID0gLTI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGMgPT09IGJvdW5kYXJ5W2luZGV4ICsgMl0pIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgUy5IRUFERVJfRklFTERfU1RBUlQ6XG5cdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUl9GSUVMRDtcblx0XHRcdFx0XHRtYXJrKCdvbkhlYWRlckZpZWxkJyk7XG5cdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHRcdC8vIGZhbGxzIHRocm91Z2hcblx0XHRcdFx0Y2FzZSBTLkhFQURFUl9GSUVMRDpcblx0XHRcdFx0XHRpZiAoYyA9PT0gQ1IpIHtcblx0XHRcdFx0XHRcdGNsZWFyKCdvbkhlYWRlckZpZWxkJyk7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSU19BTE1PU1RfRE9ORTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdFx0aWYgKGMgPT09IEhZUEhFTikge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGMgPT09IENPTE9OKSB7XG5cdFx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0Ly8gZW1wdHkgaGVhZGVyIGZpZWxkXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZGF0YUNhbGxiYWNrKCdvbkhlYWRlckZpZWxkJywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFMuSEVBREVSX1ZBTFVFX1NUQVJUO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y2wgPSBsb3dlcihjKTtcblx0XHRcdFx0XHRpZiAoY2wgPCBBIHx8IGNsID4gWikge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFMuSEVBREVSX1ZBTFVFX1NUQVJUOlxuXHRcdFx0XHRcdGlmIChjID09PSBTUEFDRSkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bWFyaygnb25IZWFkZXJWYWx1ZScpO1xuXHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfVkFMVUU7XG5cdFx0XHRcdFx0Ly8gZmFsbHMgdGhyb3VnaFxuXHRcdFx0XHRjYXNlIFMuSEVBREVSX1ZBTFVFOlxuXHRcdFx0XHRcdGlmIChjID09PSBDUikge1xuXHRcdFx0XHRcdFx0ZGF0YUNhbGxiYWNrKCdvbkhlYWRlclZhbHVlJywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnb25IZWFkZXJFbmQnKTtcblx0XHRcdFx0XHRcdHN0YXRlID0gUy5IRUFERVJfVkFMVUVfQUxNT1NUX0RPTkU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgUy5IRUFERVJfVkFMVUVfQUxNT1NUX0RPTkU6XG5cdFx0XHRcdFx0aWYgKGMgIT09IExGKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUl9GSUVMRF9TVEFSVDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBTLkhFQURFUlNfQUxNT1NUX0RPTkU6XG5cdFx0XHRcdFx0aWYgKGMgIT09IExGKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y2FsbGJhY2soJ29uSGVhZGVyc0VuZCcpO1xuXHRcdFx0XHRcdHN0YXRlID0gUy5QQVJUX0RBVEFfU1RBUlQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgUy5QQVJUX0RBVEFfU1RBUlQ6XG5cdFx0XHRcdFx0c3RhdGUgPSBTLlBBUlRfREFUQTtcblx0XHRcdFx0XHRtYXJrKCdvblBhcnREYXRhJyk7XG5cdFx0XHRcdFx0Ly8gZmFsbHMgdGhyb3VnaFxuXHRcdFx0XHRjYXNlIFMuUEFSVF9EQVRBOlxuXHRcdFx0XHRcdHByZXZpb3VzSW5kZXggPSBpbmRleDtcblxuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0Ly8gYm95ZXItbW9vcmUgZGVycml2ZWQgYWxnb3JpdGhtIHRvIHNhZmVseSBza2lwIG5vbi1ib3VuZGFyeSBkYXRhXG5cdFx0XHRcdFx0XHRpICs9IGJvdW5kYXJ5RW5kO1xuXHRcdFx0XHRcdFx0d2hpbGUgKGkgPCBidWZmZXJMZW5ndGggJiYgIShkYXRhW2ldIGluIGJvdW5kYXJ5Q2hhcnMpKSB7XG5cdFx0XHRcdFx0XHRcdGkgKz0gYm91bmRhcnlMZW5ndGg7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGkgLT0gYm91bmRhcnlFbmQ7XG5cdFx0XHRcdFx0XHRjID0gZGF0YVtpXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoaW5kZXggPCBib3VuZGFyeS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGlmIChib3VuZGFyeVtpbmRleF0gPT09IGMpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUNhbGxiYWNrKCdvblBhcnREYXRhJywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaW5kZXggPT09IGJvdW5kYXJ5Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblx0XHRcdFx0XHRcdGlmIChjID09PSBDUikge1xuXHRcdFx0XHRcdFx0XHQvLyBDUiA9IHBhcnQgYm91bmRhcnlcblx0XHRcdFx0XHRcdFx0ZmxhZ3MgfD0gRi5QQVJUX0JPVU5EQVJZO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChjID09PSBIWVBIRU4pIHtcblx0XHRcdFx0XHRcdFx0Ly8gSFlQSEVOID0gZW5kIGJvdW5kYXJ5XG5cdFx0XHRcdFx0XHRcdGZsYWdzIHw9IEYuTEFTVF9CT1VOREFSWTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGluZGV4IC0gMSA9PT0gYm91bmRhcnkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRpZiAoZmxhZ3MgJiBGLlBBUlRfQk9VTkRBUlkpIHtcblx0XHRcdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0XHRpZiAoYyA9PT0gTEYpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyB1bnNldCB0aGUgUEFSVF9CT1VOREFSWSBmbGFnXG5cdFx0XHRcdFx0XHRcdFx0ZmxhZ3MgJj0gfkYuUEFSVF9CT1VOREFSWTtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjaygnb25QYXJ0RW5kJyk7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uUGFydEJlZ2luJyk7XG5cdFx0XHRcdFx0XHRcdFx0c3RhdGUgPSBTLkhFQURFUl9GSUVMRF9TVEFSVDtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmbGFncyAmIEYuTEFTVF9CT1VOREFSWSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoYyA9PT0gSFlQSEVOKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soJ29uUGFydEVuZCcpO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXRlID0gUy5FTkQ7XG5cdFx0XHRcdFx0XHRcdFx0ZmxhZ3MgPSAwO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGluZGV4ID0gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aW5kZXggPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChpbmRleCA+IDApIHtcblx0XHRcdFx0XHRcdC8vIHdoZW4gbWF0Y2hpbmcgYSBwb3NzaWJsZSBib3VuZGFyeSwga2VlcCBhIGxvb2tiZWhpbmQgcmVmZXJlbmNlXG5cdFx0XHRcdFx0XHQvLyBpbiBjYXNlIGl0IHR1cm5zIG91dCB0byBiZSBhIGZhbHNlIGxlYWRcblx0XHRcdFx0XHRcdGxvb2tiZWhpbmRbaW5kZXggLSAxXSA9IGM7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwcmV2aW91c0luZGV4ID4gMCkge1xuXHRcdFx0XHRcdFx0Ly8gaWYgb3VyIGJvdW5kYXJ5IHR1cm5lZCBvdXQgdG8gYmUgcnViYmlzaCwgdGhlIGNhcHR1cmVkIGxvb2tiZWhpbmRcblx0XHRcdFx0XHRcdC8vIGJlbG9uZ3MgdG8gcGFydERhdGFcblx0XHRcdFx0XHRcdGNvbnN0IF9sb29rYmVoaW5kID0gbmV3IFVpbnQ4QXJyYXkobG9va2JlaGluZC5idWZmZXIsIGxvb2tiZWhpbmQuYnl0ZU9mZnNldCwgbG9va2JlaGluZC5ieXRlTGVuZ3RoKTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCdvblBhcnREYXRhJywgMCwgcHJldmlvdXNJbmRleCwgX2xvb2tiZWhpbmQpO1xuXHRcdFx0XHRcdFx0cHJldmlvdXNJbmRleCA9IDA7XG5cdFx0XHRcdFx0XHRtYXJrKCdvblBhcnREYXRhJyk7XG5cblx0XHRcdFx0XHRcdC8vIHJlY29uc2lkZXIgdGhlIGN1cnJlbnQgY2hhcmFjdGVyIGV2ZW4gc28gaXQgaW50ZXJydXB0ZWQgdGhlIHNlcXVlbmNlXG5cdFx0XHRcdFx0XHQvLyBpdCBjb3VsZCBiZSB0aGUgYmVnaW5uaW5nIG9mIGEgbmV3IHNlcXVlbmNlXG5cdFx0XHRcdFx0XHRpLS07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgUy5FTkQ6XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHN0YXRlIGVudGVyZWQ6ICR7c3RhdGV9YCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZGF0YUNhbGxiYWNrKCdvbkhlYWRlckZpZWxkJyk7XG5cdFx0ZGF0YUNhbGxiYWNrKCdvbkhlYWRlclZhbHVlJyk7XG5cdFx0ZGF0YUNhbGxiYWNrKCdvblBhcnREYXRhJyk7XG5cblx0XHQvLyBVcGRhdGUgcHJvcGVydGllcyBmb3IgdGhlIG5leHQgY2FsbFxuXHRcdHRoaXMuaW5kZXggPSBpbmRleDtcblx0XHR0aGlzLnN0YXRlID0gc3RhdGU7XG5cdFx0dGhpcy5mbGFncyA9IGZsYWdzO1xuXHR9XG5cblx0ZW5kKCkge1xuXHRcdGlmICgodGhpcy5zdGF0ZSA9PT0gUy5IRUFERVJfRklFTERfU1RBUlQgJiYgdGhpcy5pbmRleCA9PT0gMCkgfHxcblx0XHRcdCh0aGlzLnN0YXRlID09PSBTLlBBUlRfREFUQSAmJiB0aGlzLmluZGV4ID09PSB0aGlzLmJvdW5kYXJ5Lmxlbmd0aCkpIHtcblx0XHRcdHRoaXMub25QYXJ0RW5kKCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlICE9PSBTLkVORCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdNdWx0aXBhcnRQYXJzZXIuZW5kKCk6IHN0cmVhbSBlbmRlZCB1bmV4cGVjdGVkbHknKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gX2ZpbGVOYW1lKGhlYWRlclZhbHVlKSB7XG5cdC8vIG1hdGNoZXMgZWl0aGVyIGEgcXVvdGVkLXN0cmluZyBvciBhIHRva2VuIChSRkMgMjYxNiBzZWN0aW9uIDE5LjUuMSlcblx0Y29uc3QgbSA9IGhlYWRlclZhbHVlLm1hdGNoKC9cXGJmaWxlbmFtZT0oXCIoLio/KVwifChbXigpPD5ALDs6XFxcXFwiL1tcXF0/PXt9XFxzXFx0XSspKSgkfDtcXHMpL2kpO1xuXHRpZiAoIW0pIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBtYXRjaCA9IG1bMl0gfHwgbVszXSB8fCAnJztcblx0bGV0IGZpbGVuYW1lID0gbWF0Y2guc2xpY2UobWF0Y2gubGFzdEluZGV4T2YoJ1xcXFwnKSArIDEpO1xuXHRmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoLyUyMi9nLCAnXCInKTtcblx0ZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC8mIyhcXGR7NH0pOy9nLCAobSwgY29kZSkgPT4ge1xuXHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xuXHR9KTtcblx0cmV0dXJuIGZpbGVuYW1lO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9Gb3JtRGF0YShCb2R5LCBjdCkge1xuXHRpZiAoIS9tdWx0aXBhcnQvaS50ZXN0KGN0KSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCcpO1xuXHR9XG5cblx0Y29uc3QgbSA9IGN0Lm1hdGNoKC9ib3VuZGFyeT0oPzpcIihbXlwiXSspXCJ8KFteO10rKSkvaSk7XG5cblx0aWYgKCFtKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignbm8gb3IgYmFkIGNvbnRlbnQtdHlwZSBoZWFkZXIsIG5vIG11bHRpcGFydCBib3VuZGFyeScpO1xuXHR9XG5cblx0Y29uc3QgcGFyc2VyID0gbmV3IE11bHRpcGFydFBhcnNlcihtWzFdIHx8IG1bMl0pO1xuXG5cdGxldCBoZWFkZXJGaWVsZDtcblx0bGV0IGhlYWRlclZhbHVlO1xuXHRsZXQgZW50cnlWYWx1ZTtcblx0bGV0IGVudHJ5TmFtZTtcblx0bGV0IGNvbnRlbnRUeXBlO1xuXHRsZXQgZmlsZW5hbWU7XG5cdGNvbnN0IGVudHJ5Q2h1bmtzID0gW107XG5cdGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cblx0Y29uc3Qgb25QYXJ0RGF0YSA9IHVpOGEgPT4ge1xuXHRcdGVudHJ5VmFsdWUgKz0gZGVjb2Rlci5kZWNvZGUodWk4YSwge3N0cmVhbTogdHJ1ZX0pO1xuXHR9O1xuXG5cdGNvbnN0IGFwcGVuZFRvRmlsZSA9IHVpOGEgPT4ge1xuXHRcdGVudHJ5Q2h1bmtzLnB1c2godWk4YSk7XG5cdH07XG5cblx0Y29uc3QgYXBwZW5kRmlsZVRvRm9ybURhdGEgPSAoKSA9PiB7XG5cdFx0Y29uc3QgZmlsZSA9IG5ldyBGaWxlKGVudHJ5Q2h1bmtzLCBmaWxlbmFtZSwge3R5cGU6IGNvbnRlbnRUeXBlfSk7XG5cdFx0Zm9ybURhdGEuYXBwZW5kKGVudHJ5TmFtZSwgZmlsZSk7XG5cdH07XG5cblx0Y29uc3QgYXBwZW5kRW50cnlUb0Zvcm1EYXRhID0gKCkgPT4ge1xuXHRcdGZvcm1EYXRhLmFwcGVuZChlbnRyeU5hbWUsIGVudHJ5VmFsdWUpO1xuXHR9O1xuXG5cdGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0Zi04Jyk7XG5cdGRlY29kZXIuZGVjb2RlKCk7XG5cblx0cGFyc2VyLm9uUGFydEJlZ2luID0gZnVuY3Rpb24gKCkge1xuXHRcdHBhcnNlci5vblBhcnREYXRhID0gb25QYXJ0RGF0YTtcblx0XHRwYXJzZXIub25QYXJ0RW5kID0gYXBwZW5kRW50cnlUb0Zvcm1EYXRhO1xuXG5cdFx0aGVhZGVyRmllbGQgPSAnJztcblx0XHRoZWFkZXJWYWx1ZSA9ICcnO1xuXHRcdGVudHJ5VmFsdWUgPSAnJztcblx0XHRlbnRyeU5hbWUgPSAnJztcblx0XHRjb250ZW50VHlwZSA9ICcnO1xuXHRcdGZpbGVuYW1lID0gbnVsbDtcblx0XHRlbnRyeUNodW5rcy5sZW5ndGggPSAwO1xuXHR9O1xuXG5cdHBhcnNlci5vbkhlYWRlckZpZWxkID0gZnVuY3Rpb24gKHVpOGEpIHtcblx0XHRoZWFkZXJGaWVsZCArPSBkZWNvZGVyLmRlY29kZSh1aThhLCB7c3RyZWFtOiB0cnVlfSk7XG5cdH07XG5cblx0cGFyc2VyLm9uSGVhZGVyVmFsdWUgPSBmdW5jdGlvbiAodWk4YSkge1xuXHRcdGhlYWRlclZhbHVlICs9IGRlY29kZXIuZGVjb2RlKHVpOGEsIHtzdHJlYW06IHRydWV9KTtcblx0fTtcblxuXHRwYXJzZXIub25IZWFkZXJFbmQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0aGVhZGVyVmFsdWUgKz0gZGVjb2Rlci5kZWNvZGUoKTtcblx0XHRoZWFkZXJGaWVsZCA9IGhlYWRlckZpZWxkLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRpZiAoaGVhZGVyRmllbGQgPT09ICdjb250ZW50LWRpc3Bvc2l0aW9uJykge1xuXHRcdFx0Ly8gbWF0Y2hlcyBlaXRoZXIgYSBxdW90ZWQtc3RyaW5nIG9yIGEgdG9rZW4gKFJGQyAyNjE2IHNlY3Rpb24gMTkuNS4xKVxuXHRcdFx0Y29uc3QgbSA9IGhlYWRlclZhbHVlLm1hdGNoKC9cXGJuYW1lPShcIihbXlwiXSopXCJ8KFteKCk8PkAsOzpcXFxcXCIvW1xcXT89e31cXHNcXHRdKykpL2kpO1xuXG5cdFx0XHRpZiAobSkge1xuXHRcdFx0XHRlbnRyeU5hbWUgPSBtWzJdIHx8IG1bM10gfHwgJyc7XG5cdFx0XHR9XG5cblx0XHRcdGZpbGVuYW1lID0gX2ZpbGVOYW1lKGhlYWRlclZhbHVlKTtcblxuXHRcdFx0aWYgKGZpbGVuYW1lKSB7XG5cdFx0XHRcdHBhcnNlci5vblBhcnREYXRhID0gYXBwZW5kVG9GaWxlO1xuXHRcdFx0XHRwYXJzZXIub25QYXJ0RW5kID0gYXBwZW5kRmlsZVRvRm9ybURhdGE7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChoZWFkZXJGaWVsZCA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcblx0XHRcdGNvbnRlbnRUeXBlID0gaGVhZGVyVmFsdWU7XG5cdFx0fVxuXG5cdFx0aGVhZGVyVmFsdWUgPSAnJztcblx0XHRoZWFkZXJGaWVsZCA9ICcnO1xuXHR9O1xuXG5cdGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgQm9keSkge1xuXHRcdHBhcnNlci53cml0ZShjaHVuayk7XG5cdH1cblxuXHRwYXJzZXIuZW5kKCk7XG5cblx0cmV0dXJuIGZvcm1EYXRhO1xufVxuIiwgImltcG9ydCB7IEFjdGlvblBhbmVsLCBMaXN0LCBBY3Rpb24sIHNob3dUb2FzdCwgQ29sb3IsIFRvYXN0LCBJbWFnZSB9IGZyb20gXCJAcmF5Y2FzdC9hcGlcIjtcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFB1bGxSZXF1ZXN0IH0gZnJvbSBcIi4vY29tcG9uZW50cy90eXBlc1wiO1xuaW1wb3J0IHsgYml0YnVja2V0VXJsIH0gZnJvbSBcIi4vaGVscGVycy9iaXRidWNrZXRcIjtcbmltcG9ydCB7IGdldE15T3BlblB1bGxSZXF1ZXN0cyB9IGZyb20gXCIuL3F1ZXJpZXNcIjtcblxuaW50ZXJmYWNlIFN0YXRlIHtcbiAgcHVsbFJlcXVlc3RzPzogUHVsbFJlcXVlc3RbXTtcbiAgZXJyb3I/OiBFcnJvcjtcbn1cblxuY29uc3QgdG9QdWxsUmVxdWVzdCA9IChwcjogYW55KTogUHVsbFJlcXVlc3QgPT4ge1xuICByZXR1cm4ge1xuICAgIGlkOiBwci5pZCBhcyBudW1iZXIsXG4gICAgdGl0bGU6IHByLnRpdGxlIGFzIHN0cmluZyxcbiAgICBkZXNjcmlwdGlvbjogcHIuZGVzY3JpcHRpb24gYXMgc3RyaW5nLFxuICAgIHJlcG86IHtcbiAgICAgIG5hbWU6IHByLmZyb21SZWYucmVwb3NpdG9yeS5uYW1lIGFzIHN0cmluZyxcbiAgICB9LFxuICAgIGNvbW1lbnRDb3VudDogKHByLnByb3BlcnRpZXMuY29tbWVudENvdW50IHx8IDApIGFzIG51bWJlcixcbiAgICBhdXRob3I6IHtcbiAgICAgIHVybDogYCR7Yml0YnVja2V0VXJsfS91c2Vycy8ke3ByLmF1dGhvci51c2VyLm5hbWV9L2F2YXRhci5wbmdgIGFzIHN0cmluZyxcbiAgICAgIG5pY2tuYW1lOiBwci5hdXRob3IudXNlci5uYW1lIGFzIHN0cmluZyxcbiAgICB9LFxuICAgIHVybDogcHIubGlua3M/LnNlbGZbMF0/LmhyZWYsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTZWFyY2hQdWxsUmVxdWVzdHMoKSB7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGU8U3RhdGU+KHt9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGZldGNoUFJzID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldE15T3BlblB1bGxSZXF1ZXN0cygpO1xuICAgICAgICBjb25zdCBwcnMgPSBkYXRhLm1hcCh0b1B1bGxSZXF1ZXN0KTtcbiAgICAgICAgc2V0U3RhdGUoeyBwdWxsUmVxdWVzdHM6IHBycyB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNldFN0YXRlKHsgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvciA6IG5ldyBFcnJvcihcIlNvbWV0aGluZyB3ZW50IHdyb25nXCIpIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmZXRjaFBScygpO1xuICB9LCBbXSk7XG5cbiAgaWYgKHN0YXRlLmVycm9yKSB7XG4gICAgc2hvd1RvYXN0KFRvYXN0LlN0eWxlLkZhaWx1cmUsIFwiRmFpbGVkIGxvYWRpbmcgcmVwb3NpdG9yaWVzXCIsIHN0YXRlLmVycm9yLm1lc3NhZ2UpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8TGlzdCBpc0xvYWRpbmc9eyFzdGF0ZS5wdWxsUmVxdWVzdHMgJiYgIXN0YXRlLmVycm9yfSBzZWFyY2hCYXJQbGFjZWhvbGRlcj1cIlNlYXJjaCBieSBuYW1lLi4uXCI+XG4gICAgICA8TGlzdC5TZWN0aW9uIHRpdGxlPVwiT3BlbiBQdWxsIFJlcXVlc3RzXCIgc3VidGl0bGU9e3N0YXRlLnB1bGxSZXF1ZXN0cz8ubGVuZ3RoICsgXCJcIn0+XG4gICAgICAgIHtzdGF0ZS5wdWxsUmVxdWVzdHM/Lm1hcCgocHIpID0+IChcbiAgICAgICAgICA8TGlzdC5JdGVtXG4gICAgICAgICAgICBrZXk9e3ByLmlkfVxuICAgICAgICAgICAgdGl0bGU9e3ByLnRpdGxlfVxuICAgICAgICAgICAgc3VidGl0bGU9e3ByLmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgYWNjZXNzb3JpZXM9e1tcbiAgICAgICAgICAgICAgeyB0ZXh0OiBgJHtwci5jb21tZW50Q291bnR9IFx1RDgzRFx1RENBQyAgXHUwMEI3ICBDcmVhdGVkIGJ5ICR7cHIuYXV0aG9yLm5pY2tuYW1lfWAgfSxcbiAgICAgICAgICAgICAgeyBpY29uOiB7IHNvdXJjZTogcHIuYXV0aG9yLnVybCwgbWFzazogSW1hZ2UuTWFzay5DaXJjbGUgfSB9LFxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAgIGljb249e3sgc291cmNlOiBcImljb24tcHIucG5nXCIsIHRpbnRDb2xvcjogQ29sb3IuUHJpbWFyeVRleHQgfX1cbiAgICAgICAgICAgIGFjdGlvbnM9e1xuICAgICAgICAgICAgICA8QWN0aW9uUGFuZWw+XG4gICAgICAgICAgICAgICAgPEFjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICA8QWN0aW9uLk9wZW5JbkJyb3dzZXIgdGl0bGU9XCJPcGVuIFB1bGwgUmVxdWVzdCBpbiBCcm93c2VyXCIgdXJsPXtgJHtwci51cmx9YH0gLz5cbiAgICAgICAgICAgICAgICA8L0FjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgICAgICAgICAgIDwvQWN0aW9uUGFuZWw+XG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L0xpc3QuU2VjdGlvbj5cbiAgICA8L0xpc3Q+XG4gICk7XG59XG4iLCAiaW1wb3J0IHsgZ2V0UHJlZmVyZW5jZVZhbHVlcyB9IGZyb20gXCJAcmF5Y2FzdC9hcGlcIjtcbmltcG9ydCBmZXRjaCwgeyBGZXRjaEVycm9yLCBSZXNwb25zZSB9IGZyb20gXCJub2RlLWZldGNoXCI7XG5pbXBvcnQgeyBFcnJvclRleHQsIFByZXNlbnRhYmxlRXJyb3IgfSBmcm9tIFwiLi9leGNlcHRpb25cIjtcbmltcG9ydCAqIGFzIGh0dHBzIGZyb20gXCJodHRwc1wiO1xuXG5jb25zdCBwcmVmczogeyBkb21haW46IHN0cmluZzsgdG9rZW46IHN0cmluZzsgdW5zYWZlSFRUUFM6IGJvb2xlYW4gfSA9IGdldFByZWZlcmVuY2VWYWx1ZXMoKTtcbmV4cG9ydCBjb25zdCBiaXRidWNrZXRVcmwgPSBgaHR0cHM6Ly8ke3ByZWZzLmRvbWFpbn1gO1xuXG5jb25zdCBoZWFkZXJzID0ge1xuICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7cHJlZnMudG9rZW59YCxcbiAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG59O1xuY29uc3QgYWdlbnQgPSBuZXcgaHR0cHMuQWdlbnQoeyByZWplY3RVbmF1dGhvcml6ZWQ6ICFwcmVmcy51bnNhZmVIVFRQUyB9KTtcbmNvbnN0IGluaXQgPSB7XG4gIGhlYWRlcnMsXG4gIGFnZW50LFxufTtcblxudHlwZSBRdWVyeVBhcmFtcyA9IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIH07XG50eXBlIFN0YXR1c0Vycm9ycyA9IHsgW2tleTogbnVtYmVyXTogRXJyb3JUZXh0IH07XG5cbi8qKlxuICogRmV0Y2hlcyBhIEpTT04gb2JqZWN0IG9mIHR5cGUgYFJlc3VsdGAgb3IgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgcmVxdWVzdCBmYWlscyBvciByZXR1cm5zIGEgbm9uLW9rYXkgc3RhdHVzIGNvZGUuXG4gKiBAcGFyYW0gcGF0aCB0aGUgQml0YnVja2V0IHBhdGggKHdpdGhvdXQgZG9tYWluKSB0byBmZXRjaFxuICogQHBhcmFtIHBhcmFtcyBhbiBvYmplY3QgZGVmaW5pbmcgdGhlIHF1ZXJ5IHBhcmFtcyB0byByZXF1ZXN0XG4gKiBAcGFyYW0gc3RhdHVzRXJyb3JzIGRlZmluZSBjdXN0b20gZXJyb3IgdGV4dHMgZm9yIHJlc3BvbnNlIHN0YXR1cyBjb2RlcyB0byBiZSB0aHJvd25cbiAqIEB0aHJvd3MgaWYgdGhlIHJlc3BvbnNlJ3Mgc3RhdHVzIGNvZGUgaXMgbm90IG9rYXlcbiAqIEByZXR1cm4gdGhlIGJpdGJ1Y2tldCByZXNwb25zZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYml0YnVja2V0RmV0Y2hPYmplY3Q8UmVzdWx0PihcbiAgcGF0aDogc3RyaW5nLFxuICBwYXJhbXM6IFF1ZXJ5UGFyYW1zID0ge30sXG4gIHN0YXR1c0Vycm9ycz86IFN0YXR1c0Vycm9yc1xuKTogUHJvbWlzZTxSZXN1bHQ+IHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBiaXRidWNrZXRGZXRjaChwYXRoLCBwYXJhbXMsIHN0YXR1c0Vycm9ycyk7XG4gIHJldHVybiAoYXdhaXQgcmVzcG9uc2UuanNvbigpKSBhcyB1bmtub3duIGFzIFJlc3VsdDtcbn1cblxuLyoqXG4gKiBGZXRjaGVzIGEgcmVzcG9uc2UgZnJvbSBCaXRidWNrZXQgb3IgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiB0aGUgcmVxdWVzdCBmYWlscyBvciByZXR1cm5zIGEgbm9uLW9rYXkgc3RhdHVzIGNvZGUuXG4gKiBAcGFyYW0gcGF0aCB0aGUgQml0YnVja2V0IHBhdGggKHdpdGhvdXQgZG9tYWluKSB0byBmZXRjaFxuICogQHBhcmFtIHBhcmFtcyBhbiBvYmplY3QgZGVmaW5pbmcgdGhlIHF1ZXJ5IHBhcmFtcyB0byByZXF1ZXN0XG4gKiBAcGFyYW0gc3RhdHVzRXJyb3JzIGRlZmluZSBjdXN0b20gZXJyb3IgdGV4dHMgZm9yIHJlc3BvbnNlIHN0YXR1cyBjb2RlcyB0byBiZSB0aHJvd25cbiAqIEB0aHJvd3MgaWYgdGhlIHJlc3BvbnNlJ3Mgc3RhdHVzIGNvZGUgaXMgbm90IG9rYXlcbiAqIEByZXR1cm4gdGhlIGJpdGJ1Y2tldCByZXNwb25zZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYml0YnVja2V0RmV0Y2goXG4gIHBhdGg6IHN0cmluZyxcbiAgcGFyYW1zOiBRdWVyeVBhcmFtcyA9IHt9LFxuICBzdGF0dXNFcnJvcnM/OiBTdGF0dXNFcnJvcnNcbik6IFByb21pc2U8UmVzcG9uc2U+IHtcbiAgY29uc3QgcGFyYW1LZXlzID0gT2JqZWN0LmtleXMocGFyYW1zKTtcbiAgY29uc3QgcXVlcnkgPSBwYXJhbUtleXMubWFwKChrZXkpID0+IGAke2tleX09JHtlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tleV0pfWApLmpvaW4oXCImXCIpO1xuICB0cnkge1xuICAgIGNvbnN0IHNhbml0aXplZFBhdGggPSBwYXRoLnN0YXJ0c1dpdGgoXCIvXCIpID8gcGF0aC5zdWJzdHJpbmcoMSkgOiBwYXRoO1xuICAgIGNvbnN0IHVybCA9IGAke2JpdGJ1Y2tldFVybH0vJHtzYW5pdGl6ZWRQYXRofWAgKyAocXVlcnkubGVuZ3RoID4gMCA/IGA/JHtxdWVyeX1gIDogXCJcIik7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIGluaXQpO1xuICAgIHRocm93SWZSZXNwb25zZU5vdE9rYXkocmVzcG9uc2UsIHN0YXR1c0Vycm9ycyk7XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEZldGNoRXJyb3IpIHRocm93IEVycm9yKFwiQ2hlY2sgeW91ciBuZXR3b3JrIGNvbm5lY3Rpb25cIik7XG4gICAgZWxzZSB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5jb25zdCBkZWZhdWx0U3RhdHVzRXJyb3JzOiBTdGF0dXNFcnJvcnMgPSB7XG4gIDQwMTogRXJyb3JUZXh0KFwiQml0YnVja2V0IEF1dGhlbnRpY2F0aW9uIGZhaWxlZFwiLCBcIkNoZWNrIHlvdXIgQml0YnVja2V0IGNyZWRlbnRpYWxzIGluIHRoZSBwcmVmZXJlbmNlcy5cIiksXG59O1xuXG5mdW5jdGlvbiB0aHJvd0lmUmVzcG9uc2VOb3RPa2F5KHJlc3BvbnNlOiBSZXNwb25zZSwgc3RhdHVzRXJyb3JzPzogU3RhdHVzRXJyb3JzKSB7XG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBjb25zdCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICAgY29uc3QgZGVmaW5lZFN0YXR1cyA9IHN0YXR1c0Vycm9ycyA/IHsgLi4uZGVmYXVsdFN0YXR1c0Vycm9ycywgLi4uc3RhdHVzRXJyb3JzIH0gOiBkZWZhdWx0U3RhdHVzRXJyb3JzO1xuICAgIGNvbnN0IGV4YWN0U3RhdHVzRXJyb3IgPSBkZWZpbmVkU3RhdHVzW3N0YXR1c107XG4gICAgaWYgKGV4YWN0U3RhdHVzRXJyb3IpIHRocm93IG5ldyBQcmVzZW50YWJsZUVycm9yKGV4YWN0U3RhdHVzRXJyb3IubmFtZSwgZXhhY3RTdGF0dXNFcnJvci5tZXNzYWdlKTtcbiAgICBlbHNlIGlmIChzdGF0dXMgPj0gNTAwKSB0aHJvdyBuZXcgUHJlc2VudGFibGVFcnJvcihcIkJpdGJ1Y2tldCBFcnJvclwiLCBgU2VydmVyIGVycm9yICR7c3RhdHVzfWApO1xuICAgIGVsc2UgdGhyb3cgbmV3IFByZXNlbnRhYmxlRXJyb3IoXCJCaXRidWNrZXQgRXJyb3JcIiwgYFJlcXVlc3QgZXJyb3IgJHtzdGF0dXN9YCk7XG4gIH1cbn1cbiIsICIvKipcbiAqIEluZGV4LmpzXG4gKlxuICogYSByZXF1ZXN0IEFQSSBjb21wYXRpYmxlIHdpdGggd2luZG93LmZldGNoXG4gKlxuICogQWxsIHNwZWMgYWxnb3JpdGhtIHN0ZXAgbnVtYmVycyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvY29tbWl0LXNuYXBzaG90cy9hZTcxNjgyMmNiM2E2MTg0MzIyNmNkMDkwZWVmYzY1ODk0NDZjMWQyLy5cbiAqL1xuXG5pbXBvcnQgaHR0cCBmcm9tICdub2RlOmh0dHAnO1xuaW1wb3J0IGh0dHBzIGZyb20gJ25vZGU6aHR0cHMnO1xuaW1wb3J0IHpsaWIgZnJvbSAnbm9kZTp6bGliJztcbmltcG9ydCBTdHJlYW0sIHtQYXNzVGhyb3VnaCwgcGlwZWxpbmUgYXMgcHVtcH0gZnJvbSAnbm9kZTpzdHJlYW0nO1xuaW1wb3J0IHtCdWZmZXJ9IGZyb20gJ25vZGU6YnVmZmVyJztcblxuaW1wb3J0IGRhdGFVcmlUb0J1ZmZlciBmcm9tICdkYXRhLXVyaS10by1idWZmZXInO1xuXG5pbXBvcnQge3dyaXRlVG9TdHJlYW0sIGNsb25lfSBmcm9tICcuL2JvZHkuanMnO1xuaW1wb3J0IFJlc3BvbnNlIGZyb20gJy4vcmVzcG9uc2UuanMnO1xuaW1wb3J0IEhlYWRlcnMsIHtmcm9tUmF3SGVhZGVyc30gZnJvbSAnLi9oZWFkZXJzLmpzJztcbmltcG9ydCBSZXF1ZXN0LCB7Z2V0Tm9kZVJlcXVlc3RPcHRpb25zfSBmcm9tICcuL3JlcXVlc3QuanMnO1xuaW1wb3J0IHtGZXRjaEVycm9yfSBmcm9tICcuL2Vycm9ycy9mZXRjaC1lcnJvci5qcyc7XG5pbXBvcnQge0Fib3J0RXJyb3J9IGZyb20gJy4vZXJyb3JzL2Fib3J0LWVycm9yLmpzJztcbmltcG9ydCB7aXNSZWRpcmVjdH0gZnJvbSAnLi91dGlscy9pcy1yZWRpcmVjdC5qcyc7XG5pbXBvcnQge0Zvcm1EYXRhfSBmcm9tICdmb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzJztcbmltcG9ydCB7aXNEb21haW5PclN1YmRvbWFpbiwgaXNTYW1lUHJvdG9jb2x9IGZyb20gJy4vdXRpbHMvaXMuanMnO1xuaW1wb3J0IHtwYXJzZVJlZmVycmVyUG9saWN5RnJvbUhlYWRlcn0gZnJvbSAnLi91dGlscy9yZWZlcnJlci5qcyc7XG5pbXBvcnQge1xuXHRCbG9iLFxuXHRGaWxlLFxuXHRmaWxlRnJvbVN5bmMsXG5cdGZpbGVGcm9tLFxuXHRibG9iRnJvbVN5bmMsXG5cdGJsb2JGcm9tXG59IGZyb20gJ2ZldGNoLWJsb2IvZnJvbS5qcyc7XG5cbmV4cG9ydCB7Rm9ybURhdGEsIEhlYWRlcnMsIFJlcXVlc3QsIFJlc3BvbnNlLCBGZXRjaEVycm9yLCBBYm9ydEVycm9yLCBpc1JlZGlyZWN0fTtcbmV4cG9ydCB7QmxvYiwgRmlsZSwgZmlsZUZyb21TeW5jLCBmaWxlRnJvbSwgYmxvYkZyb21TeW5jLCBibG9iRnJvbX07XG5cbmNvbnN0IHN1cHBvcnRlZFNjaGVtYXMgPSBuZXcgU2V0KFsnZGF0YTonLCAnaHR0cDonLCAnaHR0cHM6J10pO1xuXG4vKipcbiAqIEZldGNoIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtICAge3N0cmluZyB8IFVSTCB8IGltcG9ydCgnLi9yZXF1ZXN0JykuZGVmYXVsdH0gdXJsIC0gQWJzb2x1dGUgdXJsIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsqfSBbb3B0aW9uc19dIC0gRmV0Y2ggb3B0aW9uc1xuICogQHJldHVybiAge1Byb21pc2U8aW1wb3J0KCcuL3Jlc3BvbnNlJykuZGVmYXVsdD59XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGZldGNoKHVybCwgb3B0aW9uc18pIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHQvLyBCdWlsZCByZXF1ZXN0IG9iamVjdFxuXHRcdGNvbnN0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwsIG9wdGlvbnNfKTtcblx0XHRjb25zdCB7cGFyc2VkVVJMLCBvcHRpb25zfSA9IGdldE5vZGVSZXF1ZXN0T3B0aW9ucyhyZXF1ZXN0KTtcblx0XHRpZiAoIXN1cHBvcnRlZFNjaGVtYXMuaGFzKHBhcnNlZFVSTC5wcm90b2NvbCkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYG5vZGUtZmV0Y2ggY2Fubm90IGxvYWQgJHt1cmx9LiBVUkwgc2NoZW1lIFwiJHtwYXJzZWRVUkwucHJvdG9jb2wucmVwbGFjZSgvOiQvLCAnJyl9XCIgaXMgbm90IHN1cHBvcnRlZC5gKTtcblx0XHR9XG5cblx0XHRpZiAocGFyc2VkVVJMLnByb3RvY29sID09PSAnZGF0YTonKSB7XG5cdFx0XHRjb25zdCBkYXRhID0gZGF0YVVyaVRvQnVmZmVyKHJlcXVlc3QudXJsKTtcblx0XHRcdGNvbnN0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGRhdGEsIHtoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6IGRhdGEudHlwZUZ1bGx9fSk7XG5cdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBXcmFwIGh0dHAucmVxdWVzdCBpbnRvIGZldGNoXG5cdFx0Y29uc3Qgc2VuZCA9IChwYXJzZWRVUkwucHJvdG9jb2wgPT09ICdodHRwczonID8gaHR0cHMgOiBodHRwKS5yZXF1ZXN0O1xuXHRcdGNvbnN0IHtzaWduYWx9ID0gcmVxdWVzdDtcblx0XHRsZXQgcmVzcG9uc2UgPSBudWxsO1xuXG5cdFx0Y29uc3QgYWJvcnQgPSAoKSA9PiB7XG5cdFx0XHRjb25zdCBlcnJvciA9IG5ldyBBYm9ydEVycm9yKCdUaGUgb3BlcmF0aW9uIHdhcyBhYm9ydGVkLicpO1xuXHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdGlmIChyZXF1ZXN0LmJvZHkgJiYgcmVxdWVzdC5ib2R5IGluc3RhbmNlb2YgU3RyZWFtLlJlYWRhYmxlKSB7XG5cdFx0XHRcdHJlcXVlc3QuYm9keS5kZXN0cm95KGVycm9yKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UuYm9keSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJlc3BvbnNlLmJvZHkuZW1pdCgnZXJyb3InLCBlcnJvcik7XG5cdFx0fTtcblxuXHRcdGlmIChzaWduYWwgJiYgc2lnbmFsLmFib3J0ZWQpIHtcblx0XHRcdGFib3J0KCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgYWJvcnRBbmRGaW5hbGl6ZSA9ICgpID0+IHtcblx0XHRcdGFib3J0KCk7XG5cdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdH07XG5cblx0XHQvLyBTZW5kIHJlcXVlc3Rcblx0XHRjb25zdCByZXF1ZXN0XyA9IHNlbmQocGFyc2VkVVJMLnRvU3RyaW5nKCksIG9wdGlvbnMpO1xuXG5cdFx0aWYgKHNpZ25hbCkge1xuXHRcdFx0c2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbmRGaW5hbGl6ZSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmluYWxpemUgPSAoKSA9PiB7XG5cdFx0XHRyZXF1ZXN0Xy5hYm9ydCgpO1xuXHRcdFx0aWYgKHNpZ25hbCkge1xuXHRcdFx0XHRzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydEFuZEZpbmFsaXplKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmVxdWVzdF8ub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuXHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKGByZXF1ZXN0IHRvICR7cmVxdWVzdC51cmx9IGZhaWxlZCwgcmVhc29uOiAke2Vycm9yLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycm9yKSk7XG5cdFx0XHRmaW5hbGl6ZSgpO1xuXHRcdH0pO1xuXG5cdFx0Zml4UmVzcG9uc2VDaHVua2VkVHJhbnNmZXJCYWRFbmRpbmcocmVxdWVzdF8sIGVycm9yID0+IHtcblx0XHRcdGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5ib2R5KSB7XG5cdFx0XHRcdHJlc3BvbnNlLmJvZHkuZGVzdHJveShlcnJvcik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvKiBjOCBpZ25vcmUgbmV4dCAxOCAqL1xuXHRcdGlmIChwcm9jZXNzLnZlcnNpb24gPCAndjE0Jykge1xuXHRcdFx0Ly8gQmVmb3JlIE5vZGUuanMgMTQsIHBpcGVsaW5lKCkgZG9lcyBub3QgZnVsbHkgc3VwcG9ydCBhc3luYyBpdGVyYXRvcnMgYW5kIGRvZXMgbm90IGFsd2F5c1xuXHRcdFx0Ly8gcHJvcGVybHkgaGFuZGxlIHdoZW4gdGhlIHNvY2tldCBjbG9zZS9lbmQgZXZlbnRzIGFyZSBvdXQgb2Ygb3JkZXIuXG5cdFx0XHRyZXF1ZXN0Xy5vbignc29ja2V0JywgcyA9PiB7XG5cdFx0XHRcdGxldCBlbmRlZFdpdGhFdmVudHNDb3VudDtcblx0XHRcdFx0cy5wcmVwZW5kTGlzdGVuZXIoJ2VuZCcsICgpID0+IHtcblx0XHRcdFx0XHRlbmRlZFdpdGhFdmVudHNDb3VudCA9IHMuX2V2ZW50c0NvdW50O1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cy5wcmVwZW5kTGlzdGVuZXIoJ2Nsb3NlJywgaGFkRXJyb3IgPT4ge1xuXHRcdFx0XHRcdC8vIGlmIGVuZCBoYXBwZW5lZCBiZWZvcmUgY2xvc2UgYnV0IHRoZSBzb2NrZXQgZGlkbid0IGVtaXQgYW4gZXJyb3IsIGRvIGl0IG5vd1xuXHRcdFx0XHRcdGlmIChyZXNwb25zZSAmJiBlbmRlZFdpdGhFdmVudHNDb3VudCA8IHMuX2V2ZW50c0NvdW50ICYmICFoYWRFcnJvcikge1xuXHRcdFx0XHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1ByZW1hdHVyZSBjbG9zZScpO1xuXHRcdFx0XHRcdFx0ZXJyb3IuY29kZSA9ICdFUlJfU1RSRUFNX1BSRU1BVFVSRV9DTE9TRSc7XG5cdFx0XHRcdFx0XHRyZXNwb25zZS5ib2R5LmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXF1ZXN0Xy5vbigncmVzcG9uc2UnLCByZXNwb25zZV8gPT4ge1xuXHRcdFx0cmVxdWVzdF8uc2V0VGltZW91dCgwKTtcblx0XHRcdGNvbnN0IGhlYWRlcnMgPSBmcm9tUmF3SGVhZGVycyhyZXNwb25zZV8ucmF3SGVhZGVycyk7XG5cblx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1XG5cdFx0XHRpZiAoaXNSZWRpcmVjdChyZXNwb25zZV8uc3RhdHVzQ29kZSkpIHtcblx0XHRcdFx0Ly8gSFRUUCBmZXRjaCBzdGVwIDUuMlxuXHRcdFx0XHRjb25zdCBsb2NhdGlvbiA9IGhlYWRlcnMuZ2V0KCdMb2NhdGlvbicpO1xuXG5cdFx0XHRcdC8vIEhUVFAgZmV0Y2ggc3RlcCA1LjNcblx0XHRcdFx0bGV0IGxvY2F0aW9uVVJMID0gbnVsbDtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRsb2NhdGlvblVSTCA9IGxvY2F0aW9uID09PSBudWxsID8gbnVsbCA6IG5ldyBVUkwobG9jYXRpb24sIHJlcXVlc3QudXJsKTtcblx0XHRcdFx0fSBjYXRjaCB7XG5cdFx0XHRcdFx0Ly8gZXJyb3IgaGVyZSBjYW4gb25seSBiZSBpbnZhbGlkIFVSTCBpbiBMb2NhdGlvbjogaGVhZGVyXG5cdFx0XHRcdFx0Ly8gZG8gbm90IHRocm93IHdoZW4gb3B0aW9ucy5yZWRpcmVjdCA9PSBtYW51YWxcblx0XHRcdFx0XHQvLyBsZXQgdGhlIHVzZXIgZXh0cmFjdCB0aGUgZXJyb3JuZW91cyByZWRpcmVjdCBVUkxcblx0XHRcdFx0XHRpZiAocmVxdWVzdC5yZWRpcmVjdCAhPT0gJ21hbnVhbCcpIHtcblx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgdXJpIHJlcXVlc3RlZCByZXNwb25kcyB3aXRoIGFuIGludmFsaWQgcmVkaXJlY3QgVVJMOiAke2xvY2F0aW9ufWAsICdpbnZhbGlkLXJlZGlyZWN0JykpO1xuXHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBIVFRQIGZldGNoIHN0ZXAgNS41XG5cdFx0XHRcdHN3aXRjaCAocmVxdWVzdC5yZWRpcmVjdCkge1xuXHRcdFx0XHRcdGNhc2UgJ2Vycm9yJzpcblx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgdXJpIHJlcXVlc3RlZCByZXNwb25kcyB3aXRoIGEgcmVkaXJlY3QsIHJlZGlyZWN0IG1vZGUgaXMgc2V0IHRvIGVycm9yOiAke3JlcXVlc3QudXJsfWAsICduby1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0Y2FzZSAnbWFudWFsJzpcblx0XHRcdFx0XHRcdC8vIE5vdGhpbmcgdG8gZG9cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2ZvbGxvdyc6IHtcblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAyXG5cdFx0XHRcdFx0XHRpZiAobG9jYXRpb25VUkwgPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCA1XG5cdFx0XHRcdFx0XHRpZiAocmVxdWVzdC5jb3VudGVyID49IHJlcXVlc3QuZm9sbG93KSB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcihgbWF4aW11bSByZWRpcmVjdCByZWFjaGVkIGF0OiAke3JlcXVlc3QudXJsfWAsICdtYXgtcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0XHRcdGZpbmFsaXplKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSFRUUC1yZWRpcmVjdCBmZXRjaCBzdGVwIDYgKGNvdW50ZXIgaW5jcmVtZW50KVxuXHRcdFx0XHRcdFx0Ly8gQ3JlYXRlIGEgbmV3IFJlcXVlc3Qgb2JqZWN0LlxuXHRcdFx0XHRcdFx0Y29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdGhlYWRlcnM6IG5ldyBIZWFkZXJzKHJlcXVlc3QuaGVhZGVycyksXG5cdFx0XHRcdFx0XHRcdGZvbGxvdzogcmVxdWVzdC5mb2xsb3csXG5cdFx0XHRcdFx0XHRcdGNvdW50ZXI6IHJlcXVlc3QuY291bnRlciArIDEsXG5cdFx0XHRcdFx0XHRcdGFnZW50OiByZXF1ZXN0LmFnZW50LFxuXHRcdFx0XHRcdFx0XHRjb21wcmVzczogcmVxdWVzdC5jb21wcmVzcyxcblx0XHRcdFx0XHRcdFx0bWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcblx0XHRcdFx0XHRcdFx0Ym9keTogY2xvbmUocmVxdWVzdCksXG5cdFx0XHRcdFx0XHRcdHNpZ25hbDogcmVxdWVzdC5zaWduYWwsXG5cdFx0XHRcdFx0XHRcdHNpemU6IHJlcXVlc3Quc2l6ZSxcblx0XHRcdFx0XHRcdFx0cmVmZXJyZXI6IHJlcXVlc3QucmVmZXJyZXIsXG5cdFx0XHRcdFx0XHRcdHJlZmVycmVyUG9saWN5OiByZXF1ZXN0LnJlZmVycmVyUG9saWN5XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHQvLyB3aGVuIGZvcndhcmRpbmcgc2Vuc2l0aXZlIGhlYWRlcnMgbGlrZSBcIkF1dGhvcml6YXRpb25cIixcblx0XHRcdFx0XHRcdC8vIFwiV1dXLUF1dGhlbnRpY2F0ZVwiLCBhbmQgXCJDb29raWVcIiB0byB1bnRydXN0ZWQgdGFyZ2V0cyxcblx0XHRcdFx0XHRcdC8vIGhlYWRlcnMgd2lsbCBiZSBpZ25vcmVkIHdoZW4gZm9sbG93aW5nIGEgcmVkaXJlY3QgdG8gYSBkb21haW5cblx0XHRcdFx0XHRcdC8vIHRoYXQgaXMgbm90IGEgc3ViZG9tYWluIG1hdGNoIG9yIGV4YWN0IG1hdGNoIG9mIHRoZSBpbml0aWFsIGRvbWFpbi5cblx0XHRcdFx0XHRcdC8vIEZvciBleGFtcGxlLCBhIHJlZGlyZWN0IGZyb20gXCJmb28uY29tXCIgdG8gZWl0aGVyIFwiZm9vLmNvbVwiIG9yIFwic3ViLmZvby5jb21cIlxuXHRcdFx0XHRcdFx0Ly8gd2lsbCBmb3J3YXJkIHRoZSBzZW5zaXRpdmUgaGVhZGVycywgYnV0IGEgcmVkaXJlY3QgdG8gXCJiYXIuY29tXCIgd2lsbCBub3QuXG5cdFx0XHRcdFx0XHQvLyBoZWFkZXJzIHdpbGwgYWxzbyBiZSBpZ25vcmVkIHdoZW4gZm9sbG93aW5nIGEgcmVkaXJlY3QgdG8gYSBkb21haW4gdXNpbmdcblx0XHRcdFx0XHRcdC8vIGEgZGlmZmVyZW50IHByb3RvY29sLiBGb3IgZXhhbXBsZSwgYSByZWRpcmVjdCBmcm9tIFwiaHR0cHM6Ly9mb28uY29tXCIgdG8gXCJodHRwOi8vZm9vLmNvbVwiXG5cdFx0XHRcdFx0XHQvLyB3aWxsIG5vdCBmb3J3YXJkIHRoZSBzZW5zaXRpdmUgaGVhZGVyc1xuXHRcdFx0XHRcdFx0aWYgKCFpc0RvbWFpbk9yU3ViZG9tYWluKHJlcXVlc3QudXJsLCBsb2NhdGlvblVSTCkgfHwgIWlzU2FtZVByb3RvY29sKHJlcXVlc3QudXJsLCBsb2NhdGlvblVSTCkpIHtcblx0XHRcdFx0XHRcdFx0Zm9yIChjb25zdCBuYW1lIG9mIFsnYXV0aG9yaXphdGlvbicsICd3d3ctYXV0aGVudGljYXRlJywgJ2Nvb2tpZScsICdjb29raWUyJ10pIHtcblx0XHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5oZWFkZXJzLmRlbGV0ZShuYW1lKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgOVxuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlXy5zdGF0dXNDb2RlICE9PSAzMDMgJiYgcmVxdWVzdC5ib2R5ICYmIG9wdGlvbnNfLmJvZHkgaW5zdGFuY2VvZiBTdHJlYW0uUmVhZGFibGUpIHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKCdDYW5ub3QgZm9sbG93IHJlZGlyZWN0IHdpdGggYm9keSBiZWluZyBhIHJlYWRhYmxlIHN0cmVhbScsICd1bnN1cHBvcnRlZC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMTFcblx0XHRcdFx0XHRcdGlmIChyZXNwb25zZV8uc3RhdHVzQ29kZSA9PT0gMzAzIHx8ICgocmVzcG9uc2VfLnN0YXR1c0NvZGUgPT09IDMwMSB8fCByZXNwb25zZV8uc3RhdHVzQ29kZSA9PT0gMzAyKSAmJiByZXF1ZXN0Lm1ldGhvZCA9PT0gJ1BPU1QnKSkge1xuXHRcdFx0XHRcdFx0XHRyZXF1ZXN0T3B0aW9ucy5tZXRob2QgPSAnR0VUJztcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMuYm9keSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMuaGVhZGVycy5kZWxldGUoJ2NvbnRlbnQtbGVuZ3RoJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEhUVFAtcmVkaXJlY3QgZmV0Y2ggc3RlcCAxNFxuXHRcdFx0XHRcdFx0Y29uc3QgcmVzcG9uc2VSZWZlcnJlclBvbGljeSA9IHBhcnNlUmVmZXJyZXJQb2xpY3lGcm9tSGVhZGVyKGhlYWRlcnMpO1xuXHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlUmVmZXJyZXJQb2xpY3kpIHtcblx0XHRcdFx0XHRcdFx0cmVxdWVzdE9wdGlvbnMucmVmZXJyZXJQb2xpY3kgPSByZXNwb25zZVJlZmVycmVyUG9saWN5O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBIVFRQLXJlZGlyZWN0IGZldGNoIHN0ZXAgMTVcblx0XHRcdFx0XHRcdHJlc29sdmUoZmV0Y2gobmV3IFJlcXVlc3QobG9jYXRpb25VUkwsIHJlcXVlc3RPcHRpb25zKSkpO1xuXHRcdFx0XHRcdFx0ZmluYWxpemUoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKGBSZWRpcmVjdCBvcHRpb24gJyR7cmVxdWVzdC5yZWRpcmVjdH0nIGlzIG5vdCBhIHZhbGlkIHZhbHVlIG9mIFJlcXVlc3RSZWRpcmVjdGApKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmVwYXJlIHJlc3BvbnNlXG5cdFx0XHRpZiAoc2lnbmFsKSB7XG5cdFx0XHRcdHJlc3BvbnNlXy5vbmNlKCdlbmQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0c2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnRBbmRGaW5hbGl6ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYm9keSA9IHB1bXAocmVzcG9uc2VfLCBuZXcgUGFzc1Rocm91Z2goKSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvcHVsbC8yOTM3NlxuXHRcdFx0LyogYzggaWdub3JlIG5leHQgMyAqL1xuXHRcdFx0aWYgKHByb2Nlc3MudmVyc2lvbiA8ICd2MTIuMTAnKSB7XG5cdFx0XHRcdHJlc3BvbnNlXy5vbignYWJvcnRlZCcsIGFib3J0QW5kRmluYWxpemUpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByZXNwb25zZU9wdGlvbnMgPSB7XG5cdFx0XHRcdHVybDogcmVxdWVzdC51cmwsXG5cdFx0XHRcdHN0YXR1czogcmVzcG9uc2VfLnN0YXR1c0NvZGUsXG5cdFx0XHRcdHN0YXR1c1RleHQ6IHJlc3BvbnNlXy5zdGF0dXNNZXNzYWdlLFxuXHRcdFx0XHRoZWFkZXJzLFxuXHRcdFx0XHRzaXplOiByZXF1ZXN0LnNpemUsXG5cdFx0XHRcdGNvdW50ZXI6IHJlcXVlc3QuY291bnRlcixcblx0XHRcdFx0aGlnaFdhdGVyTWFyazogcmVxdWVzdC5oaWdoV2F0ZXJNYXJrXG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBIVFRQLW5ldHdvcmsgZmV0Y2ggc3RlcCAxMi4xLjEuM1xuXHRcdFx0Y29uc3QgY29kaW5ncyA9IGhlYWRlcnMuZ2V0KCdDb250ZW50LUVuY29kaW5nJyk7XG5cblx0XHRcdC8vIEhUVFAtbmV0d29yayBmZXRjaCBzdGVwIDEyLjEuMS40OiBoYW5kbGUgY29udGVudCBjb2RpbmdzXG5cblx0XHRcdC8vIGluIGZvbGxvd2luZyBzY2VuYXJpb3Mgd2UgaWdub3JlIGNvbXByZXNzaW9uIHN1cHBvcnRcblx0XHRcdC8vIDEuIGNvbXByZXNzaW9uIHN1cHBvcnQgaXMgZGlzYWJsZWRcblx0XHRcdC8vIDIuIEhFQUQgcmVxdWVzdFxuXHRcdFx0Ly8gMy4gbm8gQ29udGVudC1FbmNvZGluZyBoZWFkZXJcblx0XHRcdC8vIDQuIG5vIGNvbnRlbnQgcmVzcG9uc2UgKDIwNClcblx0XHRcdC8vIDUuIGNvbnRlbnQgbm90IG1vZGlmaWVkIHJlc3BvbnNlICgzMDQpXG5cdFx0XHRpZiAoIXJlcXVlc3QuY29tcHJlc3MgfHwgcmVxdWVzdC5tZXRob2QgPT09ICdIRUFEJyB8fCBjb2RpbmdzID09PSBudWxsIHx8IHJlc3BvbnNlXy5zdGF0dXNDb2RlID09PSAyMDQgfHwgcmVzcG9uc2VfLnN0YXR1c0NvZGUgPT09IDMwNCkge1xuXHRcdFx0XHRyZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZU9wdGlvbnMpO1xuXHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3IgTm9kZSB2Nitcblx0XHRcdC8vIEJlIGxlc3Mgc3RyaWN0IHdoZW4gZGVjb2RpbmcgY29tcHJlc3NlZCByZXNwb25zZXMsIHNpbmNlIHNvbWV0aW1lc1xuXHRcdFx0Ly8gc2VydmVycyBzZW5kIHNsaWdodGx5IGludmFsaWQgcmVzcG9uc2VzIHRoYXQgYXJlIHN0aWxsIGFjY2VwdGVkXG5cdFx0XHQvLyBieSBjb21tb24gYnJvd3NlcnMuXG5cdFx0XHQvLyBBbHdheXMgdXNpbmcgWl9TWU5DX0ZMVVNIIGlzIHdoYXQgY1VSTCBkb2VzLlxuXHRcdFx0Y29uc3QgemxpYk9wdGlvbnMgPSB7XG5cdFx0XHRcdGZsdXNoOiB6bGliLlpfU1lOQ19GTFVTSCxcblx0XHRcdFx0ZmluaXNoRmx1c2g6IHpsaWIuWl9TWU5DX0ZMVVNIXG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBGb3IgZ3ppcFxuXHRcdFx0aWYgKGNvZGluZ3MgPT09ICdnemlwJyB8fCBjb2RpbmdzID09PSAneC1nemlwJykge1xuXHRcdFx0XHRib2R5ID0gcHVtcChib2R5LCB6bGliLmNyZWF0ZUd1bnppcCh6bGliT3B0aW9ucyksIGVycm9yID0+IHtcblx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yIGRlZmxhdGVcblx0XHRcdGlmIChjb2RpbmdzID09PSAnZGVmbGF0ZScgfHwgY29kaW5ncyA9PT0gJ3gtZGVmbGF0ZScpIHtcblx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBpbmZhbW91cyByYXcgZGVmbGF0ZSByZXNwb25zZSBmcm9tIG9sZCBzZXJ2ZXJzXG5cdFx0XHRcdC8vIGEgaGFjayBmb3Igb2xkIElJUyBhbmQgQXBhY2hlIHNlcnZlcnNcblx0XHRcdFx0Y29uc3QgcmF3ID0gcHVtcChyZXNwb25zZV8sIG5ldyBQYXNzVGhyb3VnaCgpLCBlcnJvciA9PiB7XG5cdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJhdy5vbmNlKCdkYXRhJywgY2h1bmsgPT4ge1xuXHRcdFx0XHRcdC8vIFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM3NTE5ODI4XG5cdFx0XHRcdFx0aWYgKChjaHVua1swXSAmIDB4MEYpID09PSAweDA4KSB7XG5cdFx0XHRcdFx0XHRib2R5ID0gcHVtcChib2R5LCB6bGliLmNyZWF0ZUluZmxhdGUoKSwgZXJyb3IgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ym9keSA9IHB1bXAoYm9keSwgemxpYi5jcmVhdGVJbmZsYXRlUmF3KCksIGVycm9yID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJhdy5vbmNlKCdlbmQnLCAoKSA9PiB7XG5cdFx0XHRcdFx0Ly8gU29tZSBvbGQgSUlTIHNlcnZlcnMgcmV0dXJuIHplcm8tbGVuZ3RoIE9LIGRlZmxhdGUgcmVzcG9uc2VzLCBzb1xuXHRcdFx0XHRcdC8vICdkYXRhJyBpcyBuZXZlciBlbWl0dGVkLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmV0Y2gvbm9kZS1mZXRjaC9wdWxsLzkwM1xuXHRcdFx0XHRcdGlmICghcmVzcG9uc2UpIHtcblx0XHRcdFx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvciBiclxuXHRcdFx0aWYgKGNvZGluZ3MgPT09ICdicicpIHtcblx0XHRcdFx0Ym9keSA9IHB1bXAoYm9keSwgemxpYi5jcmVhdGVCcm90bGlEZWNvbXByZXNzKCksIGVycm9yID0+IHtcblx0XHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2VPcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gT3RoZXJ3aXNlLCB1c2UgcmVzcG9uc2UgYXMtaXNcblx0XHRcdHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlT3B0aW9ucyk7XG5cdFx0XHRyZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KTtcblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcm9taXNlL3ByZWZlci1hd2FpdC10by10aGVuXG5cdFx0d3JpdGVUb1N0cmVhbShyZXF1ZXN0XywgcmVxdWVzdCkuY2F0Y2gocmVqZWN0KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGZpeFJlc3BvbnNlQ2h1bmtlZFRyYW5zZmVyQmFkRW5kaW5nKHJlcXVlc3QsIGVycm9yQ2FsbGJhY2spIHtcblx0Y29uc3QgTEFTVF9DSFVOSyA9IEJ1ZmZlci5mcm9tKCcwXFxyXFxuXFxyXFxuJyk7XG5cblx0bGV0IGlzQ2h1bmtlZFRyYW5zZmVyID0gZmFsc2U7XG5cdGxldCBwcm9wZXJMYXN0Q2h1bmtSZWNlaXZlZCA9IGZhbHNlO1xuXHRsZXQgcHJldmlvdXNDaHVuaztcblxuXHRyZXF1ZXN0Lm9uKCdyZXNwb25zZScsIHJlc3BvbnNlID0+IHtcblx0XHRjb25zdCB7aGVhZGVyc30gPSByZXNwb25zZTtcblx0XHRpc0NodW5rZWRUcmFuc2ZlciA9IGhlYWRlcnNbJ3RyYW5zZmVyLWVuY29kaW5nJ10gPT09ICdjaHVua2VkJyAmJiAhaGVhZGVyc1snY29udGVudC1sZW5ndGgnXTtcblx0fSk7XG5cblx0cmVxdWVzdC5vbignc29ja2V0Jywgc29ja2V0ID0+IHtcblx0XHRjb25zdCBvblNvY2tldENsb3NlID0gKCkgPT4ge1xuXHRcdFx0aWYgKGlzQ2h1bmtlZFRyYW5zZmVyICYmICFwcm9wZXJMYXN0Q2h1bmtSZWNlaXZlZCkge1xuXHRcdFx0XHRjb25zdCBlcnJvciA9IG5ldyBFcnJvcignUHJlbWF0dXJlIGNsb3NlJyk7XG5cdFx0XHRcdGVycm9yLmNvZGUgPSAnRVJSX1NUUkVBTV9QUkVNQVRVUkVfQ0xPU0UnO1xuXHRcdFx0XHRlcnJvckNhbGxiYWNrKGVycm9yKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc3Qgb25EYXRhID0gYnVmID0+IHtcblx0XHRcdHByb3Blckxhc3RDaHVua1JlY2VpdmVkID0gQnVmZmVyLmNvbXBhcmUoYnVmLnNsaWNlKC01KSwgTEFTVF9DSFVOSykgPT09IDA7XG5cblx0XHRcdC8vIFNvbWV0aW1lcyBmaW5hbCAwLWxlbmd0aCBjaHVuayBhbmQgZW5kIG9mIG1lc3NhZ2UgY29kZSBhcmUgaW4gc2VwYXJhdGUgcGFja2V0c1xuXHRcdFx0aWYgKCFwcm9wZXJMYXN0Q2h1bmtSZWNlaXZlZCAmJiBwcmV2aW91c0NodW5rKSB7XG5cdFx0XHRcdHByb3Blckxhc3RDaHVua1JlY2VpdmVkID0gKFxuXHRcdFx0XHRcdEJ1ZmZlci5jb21wYXJlKHByZXZpb3VzQ2h1bmsuc2xpY2UoLTMpLCBMQVNUX0NIVU5LLnNsaWNlKDAsIDMpKSA9PT0gMCAmJlxuXHRcdFx0XHRcdEJ1ZmZlci5jb21wYXJlKGJ1Zi5zbGljZSgtMiksIExBU1RfQ0hVTksuc2xpY2UoMykpID09PSAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHByZXZpb3VzQ2h1bmsgPSBidWY7XG5cdFx0fTtcblxuXHRcdHNvY2tldC5wcmVwZW5kTGlzdGVuZXIoJ2Nsb3NlJywgb25Tb2NrZXRDbG9zZSk7XG5cdFx0c29ja2V0Lm9uKCdkYXRhJywgb25EYXRhKTtcblxuXHRcdHJlcXVlc3Qub24oJ2Nsb3NlJywgKCkgPT4ge1xuXHRcdFx0c29ja2V0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uU29ja2V0Q2xvc2UpO1xuXHRcdFx0c29ja2V0LnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25EYXRhKTtcblx0XHR9KTtcblx0fSk7XG59XG4iLCAiZXhwb3J0IGludGVyZmFjZSBNaW1lQnVmZmVyIGV4dGVuZHMgQnVmZmVyIHtcblx0dHlwZTogc3RyaW5nO1xuXHR0eXBlRnVsbDogc3RyaW5nO1xuXHRjaGFyc2V0OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGBCdWZmZXJgIGluc3RhbmNlIGZyb20gdGhlIGdpdmVuIGRhdGEgVVJJIGB1cmlgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmkgRGF0YSBVUkkgdG8gdHVybiBpbnRvIGEgQnVmZmVyIGluc3RhbmNlXG4gKiBAcmV0dXJucyB7QnVmZmVyfSBCdWZmZXIgaW5zdGFuY2UgZnJvbSBEYXRhIFVSSVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGFVcmlUb0J1ZmZlcih1cmk6IHN0cmluZyk6IE1pbWVCdWZmZXIge1xuXHRpZiAoIS9eZGF0YTovaS50ZXN0KHVyaSkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFxuXHRcdFx0J2B1cmlgIGRvZXMgbm90IGFwcGVhciB0byBiZSBhIERhdGEgVVJJIChtdXN0IGJlZ2luIHdpdGggXCJkYXRhOlwiKSdcblx0XHQpO1xuXHR9XG5cblx0Ly8gc3RyaXAgbmV3bGluZXNcblx0dXJpID0gdXJpLnJlcGxhY2UoL1xccj9cXG4vZywgJycpO1xuXG5cdC8vIHNwbGl0IHRoZSBVUkkgdXAgaW50byB0aGUgXCJtZXRhZGF0YVwiIGFuZCB0aGUgXCJkYXRhXCIgcG9ydGlvbnNcblx0Y29uc3QgZmlyc3RDb21tYSA9IHVyaS5pbmRleE9mKCcsJyk7XG5cdGlmIChmaXJzdENvbW1hID09PSAtMSB8fCBmaXJzdENvbW1hIDw9IDQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdtYWxmb3JtZWQgZGF0YTogVVJJJyk7XG5cdH1cblxuXHQvLyByZW1vdmUgdGhlIFwiZGF0YTpcIiBzY2hlbWUgYW5kIHBhcnNlIHRoZSBtZXRhZGF0YVxuXHRjb25zdCBtZXRhID0gdXJpLnN1YnN0cmluZyg1LCBmaXJzdENvbW1hKS5zcGxpdCgnOycpO1xuXG5cdGxldCBjaGFyc2V0ID0gJyc7XG5cdGxldCBiYXNlNjQgPSBmYWxzZTtcblx0Y29uc3QgdHlwZSA9IG1ldGFbMF0gfHwgJ3RleHQvcGxhaW4nO1xuXHRsZXQgdHlwZUZ1bGwgPSB0eXBlO1xuXHRmb3IgKGxldCBpID0gMTsgaSA8IG1ldGEubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAobWV0YVtpXSA9PT0gJ2Jhc2U2NCcpIHtcblx0XHRcdGJhc2U2NCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmKG1ldGFbaV0pIHtcblx0XHRcdHR5cGVGdWxsICs9IGA7JHsgIG1ldGFbaV19YDtcblx0XHRcdGlmIChtZXRhW2ldLmluZGV4T2YoJ2NoYXJzZXQ9JykgPT09IDApIHtcblx0XHRcdFx0Y2hhcnNldCA9IG1ldGFbaV0uc3Vic3RyaW5nKDgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvLyBkZWZhdWx0cyB0byBVUy1BU0NJSSBvbmx5IGlmIHR5cGUgaXMgbm90IHByb3ZpZGVkXG5cdGlmICghbWV0YVswXSAmJiAhY2hhcnNldC5sZW5ndGgpIHtcblx0XHR0eXBlRnVsbCArPSAnO2NoYXJzZXQ9VVMtQVNDSUknO1xuXHRcdGNoYXJzZXQgPSAnVVMtQVNDSUknO1xuXHR9XG5cblx0Ly8gZ2V0IHRoZSBlbmNvZGVkIGRhdGEgcG9ydGlvbiBhbmQgZGVjb2RlIFVSSS1lbmNvZGVkIGNoYXJzXG5cdGNvbnN0IGVuY29kaW5nID0gYmFzZTY0ID8gJ2Jhc2U2NCcgOiAnYXNjaWknO1xuXHRjb25zdCBkYXRhID0gdW5lc2NhcGUodXJpLnN1YnN0cmluZyhmaXJzdENvbW1hICsgMSkpO1xuXHRjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShkYXRhLCBlbmNvZGluZykgYXMgTWltZUJ1ZmZlcjtcblxuXHQvLyBzZXQgYC50eXBlYCBhbmQgYC50eXBlRnVsbGAgcHJvcGVydGllcyB0byBNSU1FIHR5cGVcblx0YnVmZmVyLnR5cGUgPSB0eXBlO1xuXHRidWZmZXIudHlwZUZ1bGwgPSB0eXBlRnVsbDtcblxuXHQvLyBzZXQgdGhlIGAuY2hhcnNldGAgcHJvcGVydHlcblx0YnVmZmVyLmNoYXJzZXQgPSBjaGFyc2V0O1xuXG5cdHJldHVybiBidWZmZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhdGFVcmlUb0J1ZmZlcjtcbiIsICJcbi8qKlxuICogQm9keS5qc1xuICpcbiAqIEJvZHkgaW50ZXJmYWNlIHByb3ZpZGVzIGNvbW1vbiBtZXRob2RzIGZvciBSZXF1ZXN0IGFuZCBSZXNwb25zZVxuICovXG5cbmltcG9ydCBTdHJlYW0sIHtQYXNzVGhyb3VnaH0gZnJvbSAnbm9kZTpzdHJlYW0nO1xuaW1wb3J0IHt0eXBlcywgZGVwcmVjYXRlLCBwcm9taXNpZnl9IGZyb20gJ25vZGU6dXRpbCc7XG5pbXBvcnQge0J1ZmZlcn0gZnJvbSAnbm9kZTpidWZmZXInO1xuXG5pbXBvcnQgQmxvYiBmcm9tICdmZXRjaC1ibG9iJztcbmltcG9ydCB7Rm9ybURhdGEsIGZvcm1EYXRhVG9CbG9ifSBmcm9tICdmb3JtZGF0YS1wb2x5ZmlsbC9lc20ubWluLmpzJztcblxuaW1wb3J0IHtGZXRjaEVycm9yfSBmcm9tICcuL2Vycm9ycy9mZXRjaC1lcnJvci5qcyc7XG5pbXBvcnQge0ZldGNoQmFzZUVycm9yfSBmcm9tICcuL2Vycm9ycy9iYXNlLmpzJztcbmltcG9ydCB7aXNCbG9iLCBpc1VSTFNlYXJjaFBhcmFtZXRlcnN9IGZyb20gJy4vdXRpbHMvaXMuanMnO1xuXG5jb25zdCBwaXBlbGluZSA9IHByb21pc2lmeShTdHJlYW0ucGlwZWxpbmUpO1xuY29uc3QgSU5URVJOQUxTID0gU3ltYm9sKCdCb2R5IGludGVybmFscycpO1xuXG4vKipcbiAqIEJvZHkgbWl4aW5cbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNib2R5XG4gKlxuICogQHBhcmFtICAgU3RyZWFtICBib2R5ICBSZWFkYWJsZSBzdHJlYW1cbiAqIEBwYXJhbSAgIE9iamVjdCAgb3B0cyAgUmVzcG9uc2Ugb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2R5IHtcblx0Y29uc3RydWN0b3IoYm9keSwge1xuXHRcdHNpemUgPSAwXG5cdH0gPSB7fSkge1xuXHRcdGxldCBib3VuZGFyeSA9IG51bGw7XG5cblx0XHRpZiAoYm9keSA9PT0gbnVsbCkge1xuXHRcdFx0Ly8gQm9keSBpcyB1bmRlZmluZWQgb3IgbnVsbFxuXHRcdFx0Ym9keSA9IG51bGw7XG5cdFx0fSBlbHNlIGlmIChpc1VSTFNlYXJjaFBhcmFtZXRlcnMoYm9keSkpIHtcblx0XHRcdC8vIEJvZHkgaXMgYSBVUkxTZWFyY2hQYXJhbXNcblx0XHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5LnRvU3RyaW5nKCkpO1xuXHRcdH0gZWxzZSBpZiAoaXNCbG9iKGJvZHkpKSB7XG5cdFx0XHQvLyBCb2R5IGlzIGJsb2Jcblx0XHR9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuXHRcdFx0Ly8gQm9keSBpcyBCdWZmZXJcblx0XHR9IGVsc2UgaWYgKHR5cGVzLmlzQW55QXJyYXlCdWZmZXIoYm9keSkpIHtcblx0XHRcdC8vIEJvZHkgaXMgQXJyYXlCdWZmZXJcblx0XHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5KTtcblx0XHR9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhib2R5KSkge1xuXHRcdFx0Ly8gQm9keSBpcyBBcnJheUJ1ZmZlclZpZXdcblx0XHRcdGJvZHkgPSBCdWZmZXIuZnJvbShib2R5LmJ1ZmZlciwgYm9keS5ieXRlT2Zmc2V0LCBib2R5LmJ5dGVMZW5ndGgpO1xuXHRcdH0gZWxzZSBpZiAoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkge1xuXHRcdFx0Ly8gQm9keSBpcyBzdHJlYW1cblx0XHR9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBGb3JtRGF0YSkge1xuXHRcdFx0Ly8gQm9keSBpcyBGb3JtRGF0YVxuXHRcdFx0Ym9keSA9IGZvcm1EYXRhVG9CbG9iKGJvZHkpO1xuXHRcdFx0Ym91bmRhcnkgPSBib2R5LnR5cGUuc3BsaXQoJz0nKVsxXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gTm9uZSBvZiB0aGUgYWJvdmVcblx0XHRcdC8vIGNvZXJjZSB0byBzdHJpbmcgdGhlbiBidWZmZXJcblx0XHRcdGJvZHkgPSBCdWZmZXIuZnJvbShTdHJpbmcoYm9keSkpO1xuXHRcdH1cblxuXHRcdGxldCBzdHJlYW0gPSBib2R5O1xuXG5cdFx0aWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuXHRcdFx0c3RyZWFtID0gU3RyZWFtLlJlYWRhYmxlLmZyb20oYm9keSk7XG5cdFx0fSBlbHNlIGlmIChpc0Jsb2IoYm9keSkpIHtcblx0XHRcdHN0cmVhbSA9IFN0cmVhbS5SZWFkYWJsZS5mcm9tKGJvZHkuc3RyZWFtKCkpO1xuXHRcdH1cblxuXHRcdHRoaXNbSU5URVJOQUxTXSA9IHtcblx0XHRcdGJvZHksXG5cdFx0XHRzdHJlYW0sXG5cdFx0XHRib3VuZGFyeSxcblx0XHRcdGRpc3R1cmJlZDogZmFsc2UsXG5cdFx0XHRlcnJvcjogbnVsbFxuXHRcdH07XG5cdFx0dGhpcy5zaXplID0gc2l6ZTtcblxuXHRcdGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSB7XG5cdFx0XHRib2R5Lm9uKCdlcnJvcicsIGVycm9yXyA9PiB7XG5cdFx0XHRcdGNvbnN0IGVycm9yID0gZXJyb3JfIGluc3RhbmNlb2YgRmV0Y2hCYXNlRXJyb3IgP1xuXHRcdFx0XHRcdGVycm9yXyA6XG5cdFx0XHRcdFx0bmV3IEZldGNoRXJyb3IoYEludmFsaWQgcmVzcG9uc2UgYm9keSB3aGlsZSB0cnlpbmcgdG8gZmV0Y2ggJHt0aGlzLnVybH06ICR7ZXJyb3JfLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycm9yXyk7XG5cdFx0XHRcdHRoaXNbSU5URVJOQUxTXS5lcnJvciA9IGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0IGJvZHkoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zdHJlYW07XG5cdH1cblxuXHRnZXQgYm9keVVzZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5kaXN0dXJiZWQ7XG5cdH1cblxuXHQvKipcblx0ICogRGVjb2RlIHJlc3BvbnNlIGFzIEFycmF5QnVmZmVyXG5cdCAqXG5cdCAqIEByZXR1cm4gIFByb21pc2Vcblx0ICovXG5cdGFzeW5jIGFycmF5QnVmZmVyKCkge1xuXHRcdGNvbnN0IHtidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGh9ID0gYXdhaXQgY29uc3VtZUJvZHkodGhpcyk7XG5cdFx0cmV0dXJuIGJ1ZmZlci5zbGljZShieXRlT2Zmc2V0LCBieXRlT2Zmc2V0ICsgYnl0ZUxlbmd0aCk7XG5cdH1cblxuXHRhc3luYyBmb3JtRGF0YSgpIHtcblx0XHRjb25zdCBjdCA9IHRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpO1xuXG5cdFx0aWYgKGN0LnN0YXJ0c1dpdGgoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpKSB7XG5cdFx0XHRjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdFx0Y29uc3QgcGFyYW1ldGVycyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoYXdhaXQgdGhpcy50ZXh0KCkpO1xuXG5cdFx0XHRmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgcGFyYW1ldGVycykge1xuXHRcdFx0XHRmb3JtRGF0YS5hcHBlbmQobmFtZSwgdmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm9ybURhdGE7XG5cdFx0fVxuXG5cdFx0Y29uc3Qge3RvRm9ybURhdGF9ID0gYXdhaXQgaW1wb3J0KCcuL3V0aWxzL211bHRpcGFydC1wYXJzZXIuanMnKTtcblx0XHRyZXR1cm4gdG9Gb3JtRGF0YSh0aGlzLmJvZHksIGN0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gcmF3IHJlc3BvbnNlIGFzIEJsb2Jcblx0ICpcblx0ICogQHJldHVybiBQcm9taXNlXG5cdCAqL1xuXHRhc3luYyBibG9iKCkge1xuXHRcdGNvbnN0IGN0ID0gKHRoaXMuaGVhZGVycyAmJiB0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkgfHwgKHRoaXNbSU5URVJOQUxTXS5ib2R5ICYmIHRoaXNbSU5URVJOQUxTXS5ib2R5LnR5cGUpIHx8ICcnO1xuXHRcdGNvbnN0IGJ1ZiA9IGF3YWl0IHRoaXMuYXJyYXlCdWZmZXIoKTtcblxuXHRcdHJldHVybiBuZXcgQmxvYihbYnVmXSwge1xuXHRcdFx0dHlwZTogY3Rcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNvZGUgcmVzcG9uc2UgYXMganNvblxuXHQgKlxuXHQgKiBAcmV0dXJuICBQcm9taXNlXG5cdCAqL1xuXHRhc3luYyBqc29uKCkge1xuXHRcdGNvbnN0IHRleHQgPSBhd2FpdCB0aGlzLnRleHQoKTtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZSh0ZXh0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNvZGUgcmVzcG9uc2UgYXMgdGV4dFxuXHQgKlxuXHQgKiBAcmV0dXJuICBQcm9taXNlXG5cdCAqL1xuXHRhc3luYyB0ZXh0KCkge1xuXHRcdGNvbnN0IGJ1ZmZlciA9IGF3YWl0IGNvbnN1bWVCb2R5KHRoaXMpO1xuXHRcdHJldHVybiBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUoYnVmZmVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNvZGUgcmVzcG9uc2UgYXMgYnVmZmVyIChub24tc3BlYyBhcGkpXG5cdCAqXG5cdCAqIEByZXR1cm4gIFByb21pc2Vcblx0ICovXG5cdGJ1ZmZlcigpIHtcblx0XHRyZXR1cm4gY29uc3VtZUJvZHkodGhpcyk7XG5cdH1cbn1cblxuQm9keS5wcm90b3R5cGUuYnVmZmVyID0gZGVwcmVjYXRlKEJvZHkucHJvdG90eXBlLmJ1ZmZlciwgJ1BsZWFzZSB1c2UgXFwncmVzcG9uc2UuYXJyYXlCdWZmZXIoKVxcJyBpbnN0ZWFkIG9mIFxcJ3Jlc3BvbnNlLmJ1ZmZlcigpXFwnJywgJ25vZGUtZmV0Y2gjYnVmZmVyJyk7XG5cbi8vIEluIGJyb3dzZXJzLCBhbGwgcHJvcGVydGllcyBhcmUgZW51bWVyYWJsZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEJvZHkucHJvdG90eXBlLCB7XG5cdGJvZHk6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0Ym9keVVzZWQ6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0YXJyYXlCdWZmZXI6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0YmxvYjoge2VudW1lcmFibGU6IHRydWV9LFxuXHRqc29uOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHRleHQ6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0ZGF0YToge2dldDogZGVwcmVjYXRlKCgpID0+IHt9LFxuXHRcdCdkYXRhIGRvZXNuXFwndCBleGlzdCwgdXNlIGpzb24oKSwgdGV4dCgpLCBhcnJheUJ1ZmZlcigpLCBvciBib2R5IGluc3RlYWQnLFxuXHRcdCdodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL2lzc3Vlcy8xMDAwIChyZXNwb25zZSknKX1cbn0pO1xuXG4vKipcbiAqIENvbnN1bWUgYW5kIGNvbnZlcnQgYW4gZW50aXJlIEJvZHkgdG8gYSBCdWZmZXIuXG4gKlxuICogUmVmOiBodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jY29uY2VwdC1ib2R5LWNvbnN1bWUtYm9keVxuICpcbiAqIEByZXR1cm4gUHJvbWlzZVxuICovXG5hc3luYyBmdW5jdGlvbiBjb25zdW1lQm9keShkYXRhKSB7XG5cdGlmIChkYXRhW0lOVEVSTkFMU10uZGlzdHVyYmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgYm9keSB1c2VkIGFscmVhZHkgZm9yOiAke2RhdGEudXJsfWApO1xuXHR9XG5cblx0ZGF0YVtJTlRFUk5BTFNdLmRpc3R1cmJlZCA9IHRydWU7XG5cblx0aWYgKGRhdGFbSU5URVJOQUxTXS5lcnJvcikge1xuXHRcdHRocm93IGRhdGFbSU5URVJOQUxTXS5lcnJvcjtcblx0fVxuXG5cdGNvbnN0IHtib2R5fSA9IGRhdGE7XG5cblx0Ly8gQm9keSBpcyBudWxsXG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0cmV0dXJuIEJ1ZmZlci5hbGxvYygwKTtcblx0fVxuXG5cdC8qIGM4IGlnbm9yZSBuZXh0IDMgKi9cblx0aWYgKCEoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkpIHtcblx0XHRyZXR1cm4gQnVmZmVyLmFsbG9jKDApO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBzdHJlYW1cblx0Ly8gZ2V0IHJlYWR5IHRvIGFjdHVhbGx5IGNvbnN1bWUgdGhlIGJvZHlcblx0Y29uc3QgYWNjdW0gPSBbXTtcblx0bGV0IGFjY3VtQnl0ZXMgPSAwO1xuXG5cdHRyeSB7XG5cdFx0Zm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiBib2R5KSB7XG5cdFx0XHRpZiAoZGF0YS5zaXplID4gMCAmJiBhY2N1bUJ5dGVzICsgY2h1bmsubGVuZ3RoID4gZGF0YS5zaXplKSB7XG5cdFx0XHRcdGNvbnN0IGVycm9yID0gbmV3IEZldGNoRXJyb3IoYGNvbnRlbnQgc2l6ZSBhdCAke2RhdGEudXJsfSBvdmVyIGxpbWl0OiAke2RhdGEuc2l6ZX1gLCAnbWF4LXNpemUnKTtcblx0XHRcdFx0Ym9keS5kZXN0cm95KGVycm9yKTtcblx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHR9XG5cblx0XHRcdGFjY3VtQnl0ZXMgKz0gY2h1bmsubGVuZ3RoO1xuXHRcdFx0YWNjdW0ucHVzaChjaHVuayk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnN0IGVycm9yXyA9IGVycm9yIGluc3RhbmNlb2YgRmV0Y2hCYXNlRXJyb3IgPyBlcnJvciA6IG5ldyBGZXRjaEVycm9yKGBJbnZhbGlkIHJlc3BvbnNlIGJvZHkgd2hpbGUgdHJ5aW5nIHRvIGZldGNoICR7ZGF0YS51cmx9OiAke2Vycm9yLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycm9yKTtcblx0XHR0aHJvdyBlcnJvcl87XG5cdH1cblxuXHRpZiAoYm9keS5yZWFkYWJsZUVuZGVkID09PSB0cnVlIHx8IGJvZHkuX3JlYWRhYmxlU3RhdGUuZW5kZWQgPT09IHRydWUpIHtcblx0XHR0cnkge1xuXHRcdFx0aWYgKGFjY3VtLmV2ZXJ5KGMgPT4gdHlwZW9mIGMgPT09ICdzdHJpbmcnKSkge1xuXHRcdFx0XHRyZXR1cm4gQnVmZmVyLmZyb20oYWNjdW0uam9pbignJykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQnVmZmVyLmNvbmNhdChhY2N1bSwgYWNjdW1CeXRlcyk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBGZXRjaEVycm9yKGBDb3VsZCBub3QgY3JlYXRlIEJ1ZmZlciBmcm9tIHJlc3BvbnNlIGJvZHkgZm9yICR7ZGF0YS51cmx9OiAke2Vycm9yLm1lc3NhZ2V9YCwgJ3N5c3RlbScsIGVycm9yKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEZldGNoRXJyb3IoYFByZW1hdHVyZSBjbG9zZSBvZiBzZXJ2ZXIgcmVzcG9uc2Ugd2hpbGUgdHJ5aW5nIHRvIGZldGNoICR7ZGF0YS51cmx9YCk7XG5cdH1cbn1cblxuLyoqXG4gKiBDbG9uZSBib2R5IGdpdmVuIFJlcy9SZXEgaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgIGluc3RhbmNlICAgICAgIFJlc3BvbnNlIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIFN0cmluZyAgaGlnaFdhdGVyTWFyayAgaGlnaFdhdGVyTWFyayBmb3IgYm90aCBQYXNzVGhyb3VnaCBib2R5IHN0cmVhbXNcbiAqIEByZXR1cm4gIE1peGVkXG4gKi9cbmV4cG9ydCBjb25zdCBjbG9uZSA9IChpbnN0YW5jZSwgaGlnaFdhdGVyTWFyaykgPT4ge1xuXHRsZXQgcDE7XG5cdGxldCBwMjtcblx0bGV0IHtib2R5fSA9IGluc3RhbmNlW0lOVEVSTkFMU107XG5cblx0Ly8gRG9uJ3QgYWxsb3cgY2xvbmluZyBhIHVzZWQgYm9keVxuXHRpZiAoaW5zdGFuY2UuYm9keVVzZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjbG9uZSBib2R5IGFmdGVyIGl0IGlzIHVzZWQnKTtcblx0fVxuXG5cdC8vIENoZWNrIHRoYXQgYm9keSBpcyBhIHN0cmVhbSBhbmQgbm90IGZvcm0tZGF0YSBvYmplY3Rcblx0Ly8gbm90ZTogd2UgY2FuJ3QgY2xvbmUgdGhlIGZvcm0tZGF0YSBvYmplY3Qgd2l0aG91dCBoYXZpbmcgaXQgYXMgYSBkZXBlbmRlbmN5XG5cdGlmICgoYm9keSBpbnN0YW5jZW9mIFN0cmVhbSkgJiYgKHR5cGVvZiBib2R5LmdldEJvdW5kYXJ5ICE9PSAnZnVuY3Rpb24nKSkge1xuXHRcdC8vIFRlZSBpbnN0YW5jZSBib2R5XG5cdFx0cDEgPSBuZXcgUGFzc1Rocm91Z2goe2hpZ2hXYXRlck1hcmt9KTtcblx0XHRwMiA9IG5ldyBQYXNzVGhyb3VnaCh7aGlnaFdhdGVyTWFya30pO1xuXHRcdGJvZHkucGlwZShwMSk7XG5cdFx0Ym9keS5waXBlKHAyKTtcblx0XHQvLyBTZXQgaW5zdGFuY2UgYm9keSB0byB0ZWVkIGJvZHkgYW5kIHJldHVybiB0aGUgb3RoZXIgdGVlZCBib2R5XG5cdFx0aW5zdGFuY2VbSU5URVJOQUxTXS5zdHJlYW0gPSBwMTtcblx0XHRib2R5ID0gcDI7XG5cdH1cblxuXHRyZXR1cm4gYm9keTtcbn07XG5cbmNvbnN0IGdldE5vblNwZWNGb3JtRGF0YUJvdW5kYXJ5ID0gZGVwcmVjYXRlKFxuXHRib2R5ID0+IGJvZHkuZ2V0Qm91bmRhcnkoKSxcblx0J2Zvcm0tZGF0YSBkb2VzblxcJ3QgZm9sbG93IHRoZSBzcGVjIGFuZCByZXF1aXJlcyBzcGVjaWFsIHRyZWF0bWVudC4gVXNlIGFsdGVybmF0aXZlIHBhY2thZ2UnLFxuXHQnaHR0cHM6Ly9naXRodWIuY29tL25vZGUtZmV0Y2gvbm9kZS1mZXRjaC9pc3N1ZXMvMTE2Nydcbik7XG5cbi8qKlxuICogUGVyZm9ybXMgdGhlIG9wZXJhdGlvbiBcImV4dHJhY3QgYSBgQ29udGVudC1UeXBlYCB2YWx1ZSBmcm9tIHxvYmplY3R8XCIgYXNcbiAqIHNwZWNpZmllZCBpbiB0aGUgc3BlY2lmaWNhdGlvbjpcbiAqIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LWJvZHlpbml0LWV4dHJhY3RcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBpbnN0YW5jZS5ib2R5IGlzIHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHthbnl9IGJvZHkgQW55IG9wdGlvbnMuYm9keSBpbnB1dFxuICogQHJldHVybnMge3N0cmluZyB8IG51bGx9XG4gKi9cbmV4cG9ydCBjb25zdCBleHRyYWN0Q29udGVudFR5cGUgPSAoYm9keSwgcmVxdWVzdCkgPT4ge1xuXHQvLyBCb2R5IGlzIG51bGwgb3IgdW5kZWZpbmVkXG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvLyBCb2R5IGlzIHN0cmluZ1xuXHRpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBhIFVSTFNlYXJjaFBhcmFtc1xuXHRpZiAoaXNVUkxTZWFyY2hQYXJhbWV0ZXJzKGJvZHkpKSB7XG5cdFx0cmV0dXJuICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCc7XG5cdH1cblxuXHQvLyBCb2R5IGlzIGJsb2Jcblx0aWYgKGlzQmxvYihib2R5KSkge1xuXHRcdHJldHVybiBib2R5LnR5cGUgfHwgbnVsbDtcblx0fVxuXG5cdC8vIEJvZHkgaXMgYSBCdWZmZXIgKEJ1ZmZlciwgQXJyYXlCdWZmZXIgb3IgQXJyYXlCdWZmZXJWaWV3KVxuXHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpIHx8IHR5cGVzLmlzQW55QXJyYXlCdWZmZXIoYm9keSkgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KGJvZHkpKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRpZiAoYm9keSBpbnN0YW5jZW9mIEZvcm1EYXRhKSB7XG5cdFx0cmV0dXJuIGBtdWx0aXBhcnQvZm9ybS1kYXRhOyBib3VuZGFyeT0ke3JlcXVlc3RbSU5URVJOQUxTXS5ib3VuZGFyeX1gO1xuXHR9XG5cblx0Ly8gRGV0ZWN0IGZvcm0gZGF0YSBpbnB1dCBmcm9tIGZvcm0tZGF0YSBtb2R1bGVcblx0aWYgKGJvZHkgJiYgdHlwZW9mIGJvZHkuZ2V0Qm91bmRhcnkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gYG11bHRpcGFydC9mb3JtLWRhdGE7Ym91bmRhcnk9JHtnZXROb25TcGVjRm9ybURhdGFCb3VuZGFyeShib2R5KX1gO1xuXHR9XG5cblx0Ly8gQm9keSBpcyBzdHJlYW0gLSBjYW4ndCByZWFsbHkgZG8gbXVjaCBhYm91dCB0aGlzXG5cdGlmIChib2R5IGluc3RhbmNlb2YgU3RyZWFtKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvLyBCb2R5IGNvbnN0cnVjdG9yIGRlZmF1bHRzIG90aGVyIHRoaW5ncyB0byBzdHJpbmdcblx0cmV0dXJuICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnO1xufTtcblxuLyoqXG4gKiBUaGUgRmV0Y2ggU3RhbmRhcmQgdHJlYXRzIHRoaXMgYXMgaWYgXCJ0b3RhbCBieXRlc1wiIGlzIGEgcHJvcGVydHkgb24gdGhlIGJvZHkuXG4gKiBGb3IgdXMsIHdlIGhhdmUgdG8gZXhwbGljaXRseSBnZXQgaXQgd2l0aCBhIGZ1bmN0aW9uLlxuICpcbiAqIHJlZjogaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2NvbmNlcHQtYm9keS10b3RhbC1ieXRlc1xuICpcbiAqIEBwYXJhbSB7YW55fSBvYmouYm9keSBCb2R5IG9iamVjdCBmcm9tIHRoZSBCb2R5IGluc3RhbmNlLlxuICogQHJldHVybnMge251bWJlciB8IG51bGx9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUb3RhbEJ5dGVzID0gcmVxdWVzdCA9PiB7XG5cdGNvbnN0IHtib2R5fSA9IHJlcXVlc3RbSU5URVJOQUxTXTtcblxuXHQvLyBCb2R5IGlzIG51bGwgb3IgdW5kZWZpbmVkXG5cdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHQvLyBCb2R5IGlzIEJsb2Jcblx0aWYgKGlzQmxvYihib2R5KSkge1xuXHRcdHJldHVybiBib2R5LnNpemU7XG5cdH1cblxuXHQvLyBCb2R5IGlzIEJ1ZmZlclxuXHRpZiAoQnVmZmVyLmlzQnVmZmVyKGJvZHkpKSB7XG5cdFx0cmV0dXJuIGJvZHkubGVuZ3RoO1xuXHR9XG5cblx0Ly8gRGV0ZWN0IGZvcm0gZGF0YSBpbnB1dCBmcm9tIGZvcm0tZGF0YSBtb2R1bGVcblx0aWYgKGJvZHkgJiYgdHlwZW9mIGJvZHkuZ2V0TGVuZ3RoU3luYyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHJldHVybiBib2R5Lmhhc0tub3duTGVuZ3RoICYmIGJvZHkuaGFzS25vd25MZW5ndGgoKSA/IGJvZHkuZ2V0TGVuZ3RoU3luYygpIDogbnVsbDtcblx0fVxuXG5cdC8vIEJvZHkgaXMgc3RyZWFtXG5cdHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBXcml0ZSBhIEJvZHkgdG8gYSBOb2RlLmpzIFdyaXRhYmxlU3RyZWFtIChlLmcuIGh0dHAuUmVxdWVzdCkgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyZWFtLldyaXRhYmxlfSBkZXN0IFRoZSBzdHJlYW0gdG8gd3JpdGUgdG8uXG4gKiBAcGFyYW0gb2JqLmJvZHkgQm9keSBvYmplY3QgZnJvbSB0aGUgQm9keSBpbnN0YW5jZS5cbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICovXG5leHBvcnQgY29uc3Qgd3JpdGVUb1N0cmVhbSA9IGFzeW5jIChkZXN0LCB7Ym9keX0pID0+IHtcblx0aWYgKGJvZHkgPT09IG51bGwpIHtcblx0XHQvLyBCb2R5IGlzIG51bGxcblx0XHRkZXN0LmVuZCgpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIEJvZHkgaXMgc3RyZWFtXG5cdFx0YXdhaXQgcGlwZWxpbmUoYm9keSwgZGVzdCk7XG5cdH1cbn07XG4iLCAiZXhwb3J0IGNsYXNzIEZldGNoQmFzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtZXNzYWdlLCB0eXBlKSB7XG5cdFx0c3VwZXIobWVzc2FnZSk7XG5cdFx0Ly8gSGlkZSBjdXN0b20gZXJyb3IgaW1wbGVtZW50YXRpb24gZGV0YWlscyBmcm9tIGVuZC11c2Vyc1xuXHRcdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0fVxuXG5cdGdldCBuYW1lKCkge1xuXHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZTtcblx0fVxufVxuIiwgIlxuaW1wb3J0IHtGZXRjaEJhc2VFcnJvcn0gZnJvbSAnLi9iYXNlLmpzJztcblxuLyoqXG4gKiBAdHlwZWRlZiB7eyBhZGRyZXNzPzogc3RyaW5nLCBjb2RlOiBzdHJpbmcsIGRlc3Q/OiBzdHJpbmcsIGVycm5vOiBudW1iZXIsIGluZm8/OiBvYmplY3QsIG1lc3NhZ2U6IHN0cmluZywgcGF0aD86IHN0cmluZywgcG9ydD86IG51bWJlciwgc3lzY2FsbDogc3RyaW5nfX0gU3lzdGVtRXJyb3JcbiovXG5cbi8qKlxuICogRmV0Y2hFcnJvciBpbnRlcmZhY2UgZm9yIG9wZXJhdGlvbmFsIGVycm9yc1xuICovXG5leHBvcnQgY2xhc3MgRmV0Y2hFcnJvciBleHRlbmRzIEZldGNoQmFzZUVycm9yIHtcblx0LyoqXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gbWVzc2FnZSAtICAgICAgRXJyb3IgbWVzc2FnZSBmb3IgaHVtYW5cblx0ICogQHBhcmFtICB7c3RyaW5nfSBbdHlwZV0gLSAgICAgICAgRXJyb3IgdHlwZSBmb3IgbWFjaGluZVxuXHQgKiBAcGFyYW0gIHtTeXN0ZW1FcnJvcn0gW3N5c3RlbUVycm9yXSAtIEZvciBOb2RlLmpzIHN5c3RlbSBlcnJvclxuXHQgKi9cblx0Y29uc3RydWN0b3IobWVzc2FnZSwgdHlwZSwgc3lzdGVtRXJyb3IpIHtcblx0XHRzdXBlcihtZXNzYWdlLCB0eXBlKTtcblx0XHQvLyBXaGVuIGVyci50eXBlIGlzIGBzeXN0ZW1gLCBlcnIuZXJyb3JlZFN5c0NhbGwgY29udGFpbnMgc3lzdGVtIGVycm9yIGFuZCBlcnIuY29kZSBjb250YWlucyBzeXN0ZW0gZXJyb3IgY29kZVxuXHRcdGlmIChzeXN0ZW1FcnJvcikge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW11bHRpLWFzc2lnblxuXHRcdFx0dGhpcy5jb2RlID0gdGhpcy5lcnJubyA9IHN5c3RlbUVycm9yLmNvZGU7XG5cdFx0XHR0aGlzLmVycm9yZWRTeXNDYWxsID0gc3lzdGVtRXJyb3Iuc3lzY2FsbDtcblx0XHR9XG5cdH1cbn1cbiIsICIvKipcbiAqIElzLmpzXG4gKlxuICogT2JqZWN0IHR5cGUgY2hlY2tzLlxuICovXG5cbmNvbnN0IE5BTUUgPSBTeW1ib2wudG9TdHJpbmdUYWc7XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKiByZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlLWZldGNoL25vZGUtZmV0Y2gvaXNzdWVzLzI5NiNpc3N1ZWNvbW1lbnQtMzA3NTk4MTQzXG4gKiBAcGFyYW0geyp9IG9iamVjdCAtIE9iamVjdCB0byBjaGVjayBmb3JcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc1VSTFNlYXJjaFBhcmFtZXRlcnMgPSBvYmplY3QgPT4ge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG5cdFx0dHlwZW9mIG9iamVjdC5hcHBlbmQgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmRlbGV0ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3QuZ2V0ID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5nZXRBbGwgPT09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmhhcyA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdHR5cGVvZiBvYmplY3Quc2V0ID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5zb3J0ID09PSAnZnVuY3Rpb24nICYmXG5cdFx0b2JqZWN0W05BTUVdID09PSAnVVJMU2VhcmNoUGFyYW1zJ1xuXHQpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqZWN0YCBpcyBhIFczQyBgQmxvYmAgb2JqZWN0ICh3aGljaCBgRmlsZWAgaW5oZXJpdHMgZnJvbSlcbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IC0gT2JqZWN0IHRvIGNoZWNrIGZvclxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGlzQmxvYiA9IG9iamVjdCA9PiB7XG5cdHJldHVybiAoXG5cdFx0b2JqZWN0ICYmXG5cdFx0dHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcblx0XHR0eXBlb2Ygb2JqZWN0LmFycmF5QnVmZmVyID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC50eXBlID09PSAnc3RyaW5nJyAmJlxuXHRcdHR5cGVvZiBvYmplY3Quc3RyZWFtID09PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHRcdC9eKEJsb2J8RmlsZSkkLy50ZXN0KG9iamVjdFtOQU1FXSlcblx0KTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gaW5zdGFuY2Ugb2YgQWJvcnRTaWduYWwuXG4gKiBAcGFyYW0geyp9IG9iamVjdCAtIE9iamVjdCB0byBjaGVjayBmb3JcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc0Fib3J0U2lnbmFsID0gb2JqZWN0ID0+IHtcblx0cmV0dXJuIChcblx0XHR0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAoXG5cdFx0XHRvYmplY3RbTkFNRV0gPT09ICdBYm9ydFNpZ25hbCcgfHxcblx0XHRcdG9iamVjdFtOQU1FXSA9PT0gJ0V2ZW50VGFyZ2V0J1xuXHRcdClcblx0KTtcbn07XG5cbi8qKlxuICogaXNEb21haW5PclN1YmRvbWFpbiByZXBvcnRzIHdoZXRoZXIgc3ViIGlzIGEgc3ViZG9tYWluIChvciBleGFjdCBtYXRjaCkgb2ZcbiAqIHRoZSBwYXJlbnQgZG9tYWluLlxuICpcbiAqIEJvdGggZG9tYWlucyBtdXN0IGFscmVhZHkgYmUgaW4gY2Fub25pY2FsIGZvcm0uXG4gKiBAcGFyYW0ge3N0cmluZ3xVUkx9IG9yaWdpbmFsXG4gKiBAcGFyYW0ge3N0cmluZ3xVUkx9IGRlc3RpbmF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBpc0RvbWFpbk9yU3ViZG9tYWluID0gKGRlc3RpbmF0aW9uLCBvcmlnaW5hbCkgPT4ge1xuXHRjb25zdCBvcmlnID0gbmV3IFVSTChvcmlnaW5hbCkuaG9zdG5hbWU7XG5cdGNvbnN0IGRlc3QgPSBuZXcgVVJMKGRlc3RpbmF0aW9uKS5ob3N0bmFtZTtcblxuXHRyZXR1cm4gb3JpZyA9PT0gZGVzdCB8fCBvcmlnLmVuZHNXaXRoKGAuJHtkZXN0fWApO1xufTtcblxuLyoqXG4gKiBpc1NhbWVQcm90b2NvbCByZXBvcnRzIHdoZXRoZXIgdGhlIHR3byBwcm92aWRlZCBVUkxzIHVzZSB0aGUgc2FtZSBwcm90b2NvbC5cbiAqXG4gKiBCb3RoIGRvbWFpbnMgbXVzdCBhbHJlYWR5IGJlIGluIGNhbm9uaWNhbCBmb3JtLlxuICogQHBhcmFtIHtzdHJpbmd8VVJMfSBvcmlnaW5hbFxuICogQHBhcmFtIHtzdHJpbmd8VVJMfSBkZXN0aW5hdGlvblxuICovXG5leHBvcnQgY29uc3QgaXNTYW1lUHJvdG9jb2wgPSAoZGVzdGluYXRpb24sIG9yaWdpbmFsKSA9PiB7XG5cdGNvbnN0IG9yaWcgPSBuZXcgVVJMKG9yaWdpbmFsKS5wcm90b2NvbDtcblx0Y29uc3QgZGVzdCA9IG5ldyBVUkwoZGVzdGluYXRpb24pLnByb3RvY29sO1xuXG5cdHJldHVybiBvcmlnID09PSBkZXN0O1xufTtcbiIsICIvKipcbiAqIEhlYWRlcnMuanNcbiAqXG4gKiBIZWFkZXJzIGNsYXNzIG9mZmVycyBjb252ZW5pZW50IGhlbHBlcnNcbiAqL1xuXG5pbXBvcnQge3R5cGVzfSBmcm9tICdub2RlOnV0aWwnO1xuaW1wb3J0IGh0dHAgZnJvbSAnbm9kZTpodHRwJztcblxuLyogYzggaWdub3JlIG5leHQgOSAqL1xuY29uc3QgdmFsaWRhdGVIZWFkZXJOYW1lID0gdHlwZW9mIGh0dHAudmFsaWRhdGVIZWFkZXJOYW1lID09PSAnZnVuY3Rpb24nID9cblx0aHR0cC52YWxpZGF0ZUhlYWRlck5hbWUgOlxuXHRuYW1lID0+IHtcblx0XHRpZiAoIS9eW1xcXmBcXC1cXHchIyQlJicqKy58fl0rJC8udGVzdChuYW1lKSkge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgVHlwZUVycm9yKGBIZWFkZXIgbmFtZSBtdXN0IGJlIGEgdmFsaWQgSFRUUCB0b2tlbiBbJHtuYW1lfV1gKTtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlcnJvciwgJ2NvZGUnLCB7dmFsdWU6ICdFUlJfSU5WQUxJRF9IVFRQX1RPS0VOJ30pO1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXHR9O1xuXG4vKiBjOCBpZ25vcmUgbmV4dCA5ICovXG5jb25zdCB2YWxpZGF0ZUhlYWRlclZhbHVlID0gdHlwZW9mIGh0dHAudmFsaWRhdGVIZWFkZXJWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/XG5cdGh0dHAudmFsaWRhdGVIZWFkZXJWYWx1ZSA6XG5cdChuYW1lLCB2YWx1ZSkgPT4ge1xuXHRcdGlmICgvW15cXHRcXHUwMDIwLVxcdTAwN0VcXHUwMDgwLVxcdTAwRkZdLy50ZXN0KHZhbHVlKSkge1xuXHRcdFx0Y29uc3QgZXJyb3IgPSBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgY29udGVudCBbXCIke25hbWV9XCJdYCk7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXJyb3IsICdjb2RlJywge3ZhbHVlOiAnRVJSX0lOVkFMSURfQ0hBUid9KTtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblx0fTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7SGVhZGVycyB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBJdGVyYWJsZTxyZWFkb25seSBbc3RyaW5nLCBzdHJpbmddPiB8IEl0ZXJhYmxlPEl0ZXJhYmxlPHN0cmluZz4+fSBIZWFkZXJzSW5pdFxuICovXG5cbi8qKlxuICogVGhpcyBGZXRjaCBBUEkgaW50ZXJmYWNlIGFsbG93cyB5b3UgdG8gcGVyZm9ybSB2YXJpb3VzIGFjdGlvbnMgb24gSFRUUCByZXF1ZXN0IGFuZCByZXNwb25zZSBoZWFkZXJzLlxuICogVGhlc2UgYWN0aW9ucyBpbmNsdWRlIHJldHJpZXZpbmcsIHNldHRpbmcsIGFkZGluZyB0bywgYW5kIHJlbW92aW5nLlxuICogQSBIZWFkZXJzIG9iamVjdCBoYXMgYW4gYXNzb2NpYXRlZCBoZWFkZXIgbGlzdCwgd2hpY2ggaXMgaW5pdGlhbGx5IGVtcHR5IGFuZCBjb25zaXN0cyBvZiB6ZXJvIG9yIG1vcmUgbmFtZSBhbmQgdmFsdWUgcGFpcnMuXG4gKiBZb3UgY2FuIGFkZCB0byB0aGlzIHVzaW5nIG1ldGhvZHMgbGlrZSBhcHBlbmQoKSAoc2VlIEV4YW1wbGVzLilcbiAqIEluIGFsbCBtZXRob2RzIG9mIHRoaXMgaW50ZXJmYWNlLCBoZWFkZXIgbmFtZXMgYXJlIG1hdGNoZWQgYnkgY2FzZS1pbnNlbnNpdGl2ZSBieXRlIHNlcXVlbmNlLlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVycyBleHRlbmRzIFVSTFNlYXJjaFBhcmFtcyB7XG5cdC8qKlxuXHQgKiBIZWFkZXJzIGNsYXNzXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge0hlYWRlcnNJbml0fSBbaW5pdF0gLSBSZXNwb25zZSBoZWFkZXJzXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihpbml0KSB7XG5cdFx0Ly8gVmFsaWRhdGUgYW5kIG5vcm1hbGl6ZSBpbml0IG9iamVjdCBpbiBbbmFtZSwgdmFsdWUocyldW11cblx0XHQvKiogQHR5cGUge3N0cmluZ1tdW119ICovXG5cdFx0bGV0IHJlc3VsdCA9IFtdO1xuXHRcdGlmIChpbml0IGluc3RhbmNlb2YgSGVhZGVycykge1xuXHRcdFx0Y29uc3QgcmF3ID0gaW5pdC5yYXcoKTtcblx0XHRcdGZvciAoY29uc3QgW25hbWUsIHZhbHVlc10gb2YgT2JqZWN0LmVudHJpZXMocmF3KSkge1xuXHRcdFx0XHRyZXN1bHQucHVzaCguLi52YWx1ZXMubWFwKHZhbHVlID0+IFtuYW1lLCB2YWx1ZV0pKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGluaXQgPT0gbnVsbCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVxLW51bGwsIGVxZXFlcVxuXHRcdFx0Ly8gTm8gb3Bcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBpbml0ID09PSAnb2JqZWN0JyAmJiAhdHlwZXMuaXNCb3hlZFByaW1pdGl2ZShpbml0KSkge1xuXHRcdFx0Y29uc3QgbWV0aG9kID0gaW5pdFtTeW1ib2wuaXRlcmF0b3JdO1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsIGVxZXFlcVxuXHRcdFx0aWYgKG1ldGhvZCA9PSBudWxsKSB7XG5cdFx0XHRcdC8vIFJlY29yZDxCeXRlU3RyaW5nLCBCeXRlU3RyaW5nPlxuXHRcdFx0XHRyZXN1bHQucHVzaCguLi5PYmplY3QuZW50cmllcyhpbml0KSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodHlwZW9mIG1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0hlYWRlciBwYWlycyBtdXN0IGJlIGl0ZXJhYmxlJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTZXF1ZW5jZTxzZXF1ZW5jZTxCeXRlU3RyaW5nPj5cblx0XHRcdFx0Ly8gTm90ZTogcGVyIHNwZWMgd2UgaGF2ZSB0byBmaXJzdCBleGhhdXN0IHRoZSBsaXN0cyB0aGVuIHByb2Nlc3MgdGhlbVxuXHRcdFx0XHRyZXN1bHQgPSBbLi4uaW5pdF1cblx0XHRcdFx0XHQubWFwKHBhaXIgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHR0eXBlb2YgcGFpciAhPT0gJ29iamVjdCcgfHwgdHlwZXMuaXNCb3hlZFByaW1pdGl2ZShwYWlyKVxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0VhY2ggaGVhZGVyIHBhaXIgbXVzdCBiZSBhbiBpdGVyYWJsZSBvYmplY3QnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIFsuLi5wYWlyXTtcblx0XHRcdFx0XHR9KS5tYXAocGFpciA9PiB7XG5cdFx0XHRcdFx0XHRpZiAocGFpci5sZW5ndGggIT09IDIpIHtcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRWFjaCBoZWFkZXIgcGFpciBtdXN0IGJlIGEgbmFtZS92YWx1ZSB0dXBsZScpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gWy4uLnBhaXJdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gY29uc3RydWN0IFxcJ0hlYWRlcnNcXCc6IFRoZSBwcm92aWRlZCB2YWx1ZSBpcyBub3Qgb2YgdHlwZSBcXCcoc2VxdWVuY2U8c2VxdWVuY2U8Qnl0ZVN0cmluZz4+IG9yIHJlY29yZDxCeXRlU3RyaW5nLCBCeXRlU3RyaW5nPiknKTtcblx0XHR9XG5cblx0XHQvLyBWYWxpZGF0ZSBhbmQgbG93ZXJjYXNlXG5cdFx0cmVzdWx0ID1cblx0XHRcdHJlc3VsdC5sZW5ndGggPiAwID9cblx0XHRcdFx0cmVzdWx0Lm1hcCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuXHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyTmFtZShuYW1lKTtcblx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlclZhbHVlKG5hbWUsIFN0cmluZyh2YWx1ZSkpO1xuXHRcdFx0XHRcdHJldHVybiBbU3RyaW5nKG5hbWUpLnRvTG93ZXJDYXNlKCksIFN0cmluZyh2YWx1ZSldO1xuXHRcdFx0XHR9KSA6XG5cdFx0XHRcdHVuZGVmaW5lZDtcblxuXHRcdHN1cGVyKHJlc3VsdCk7XG5cblx0XHQvLyBSZXR1cm5pbmcgYSBQcm94eSB0aGF0IHdpbGwgbG93ZXJjYXNlIGtleSBuYW1lcywgdmFsaWRhdGUgcGFyYW1ldGVycyBhbmQgc29ydCBrZXlzXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0cnVjdG9yLXJldHVyblxuXHRcdHJldHVybiBuZXcgUHJveHkodGhpcywge1xuXHRcdFx0Z2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpIHtcblx0XHRcdFx0c3dpdGNoIChwKSB7XG5cdFx0XHRcdFx0Y2FzZSAnYXBwZW5kJzpcblx0XHRcdFx0XHRjYXNlICdzZXQnOlxuXHRcdFx0XHRcdFx0cmV0dXJuIChuYW1lLCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlck5hbWUobmFtZSk7XG5cdFx0XHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyVmFsdWUobmFtZSwgU3RyaW5nKHZhbHVlKSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlW3BdLmNhbGwoXG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRcdFN0cmluZyhuYW1lKS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0XHRcdFN0cmluZyh2YWx1ZSlcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRjYXNlICdkZWxldGUnOlxuXHRcdFx0XHRcdGNhc2UgJ2hhcyc6XG5cdFx0XHRcdFx0Y2FzZSAnZ2V0QWxsJzpcblx0XHRcdFx0XHRcdHJldHVybiBuYW1lID0+IHtcblx0XHRcdFx0XHRcdFx0dmFsaWRhdGVIZWFkZXJOYW1lKG5hbWUpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZVtwXS5jYWxsKFxuXHRcdFx0XHRcdFx0XHRcdHRhcmdldCxcblx0XHRcdFx0XHRcdFx0XHRTdHJpbmcobmFtZSkudG9Mb3dlckNhc2UoKVxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGNhc2UgJ2tleXMnOlxuXHRcdFx0XHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0LnNvcnQoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIG5ldyBTZXQoVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5rZXlzLmNhbGwodGFyZ2V0KSkua2V5cygpO1xuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRyZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwLCByZWNlaXZlcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHQvKiBjOCBpZ25vcmUgbmV4dCAqL1xuXHR9XG5cblx0Z2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuXHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG5cdH1cblxuXHR0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRoaXMpO1xuXHR9XG5cblx0Z2V0KG5hbWUpIHtcblx0XHRjb25zdCB2YWx1ZXMgPSB0aGlzLmdldEFsbChuYW1lKTtcblx0XHRpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0bGV0IHZhbHVlID0gdmFsdWVzLmpvaW4oJywgJyk7XG5cdFx0aWYgKC9eY29udGVudC1lbmNvZGluZyQvaS50ZXN0KG5hbWUpKSB7XG5cdFx0XHR2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG5cblx0Zm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZyA9IHVuZGVmaW5lZCkge1xuXHRcdGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLmtleXMoKSkge1xuXHRcdFx0UmVmbGVjdC5hcHBseShjYWxsYmFjaywgdGhpc0FyZywgW3RoaXMuZ2V0KG5hbWUpLCBuYW1lLCB0aGlzXSk7XG5cdFx0fVxuXHR9XG5cblx0KiB2YWx1ZXMoKSB7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIHRoaXMua2V5cygpKSB7XG5cdFx0XHR5aWVsZCB0aGlzLmdldChuYW1lKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHR5cGUgeygpID0+IEl0ZXJhYmxlSXRlcmF0b3I8W3N0cmluZywgc3RyaW5nXT59XG5cdCAqL1xuXHQqIGVudHJpZXMoKSB7XG5cdFx0Zm9yIChjb25zdCBuYW1lIG9mIHRoaXMua2V5cygpKSB7XG5cdFx0XHR5aWVsZCBbbmFtZSwgdGhpcy5nZXQobmFtZSldO1xuXHRcdH1cblx0fVxuXG5cdFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuXHRcdHJldHVybiB0aGlzLmVudHJpZXMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOb2RlLWZldGNoIG5vbi1zcGVjIG1ldGhvZFxuXHQgKiByZXR1cm5pbmcgYWxsIGhlYWRlcnMgYW5kIHRoZWlyIHZhbHVlcyBhcyBhcnJheVxuXHQgKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgc3RyaW5nW10+fVxuXHQgKi9cblx0cmF3KCkge1xuXHRcdHJldHVybiBbLi4udGhpcy5rZXlzKCldLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcblx0XHRcdHJlc3VsdFtrZXldID0gdGhpcy5nZXRBbGwoa2V5KTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fSwge30pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvciBiZXR0ZXIgY29uc29sZS5sb2coaGVhZGVycykgYW5kIGFsc28gdG8gY29udmVydCBIZWFkZXJzIGludG8gTm9kZS5qcyBSZXF1ZXN0IGNvbXBhdGlibGUgZm9ybWF0XG5cdCAqL1xuXHRbU3ltYm9sLmZvcignbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKV0oKSB7XG5cdFx0cmV0dXJuIFsuLi50aGlzLmtleXMoKV0ucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWVzID0gdGhpcy5nZXRBbGwoa2V5KTtcblx0XHRcdC8vIEh0dHAucmVxdWVzdCgpIG9ubHkgc3VwcG9ydHMgc3RyaW5nIGFzIEhvc3QgaGVhZGVyLlxuXHRcdFx0Ly8gVGhpcyBoYWNrIG1ha2VzIHNwZWNpZnlpbmcgY3VzdG9tIEhvc3QgaGVhZGVyIHBvc3NpYmxlLlxuXHRcdFx0aWYgKGtleSA9PT0gJ2hvc3QnKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gdmFsdWVzWzBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0W2tleV0gPSB2YWx1ZXMubGVuZ3RoID4gMSA/IHZhbHVlcyA6IHZhbHVlc1swXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LCB7fSk7XG5cdH1cbn1cblxuLyoqXG4gKiBSZS1zaGFwaW5nIG9iamVjdCBmb3IgV2ViIElETCB0ZXN0c1xuICogT25seSBuZWVkIHRvIGRvIGl0IGZvciBvdmVycmlkZGVuIG1ldGhvZHNcbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG5cdEhlYWRlcnMucHJvdG90eXBlLFxuXHRbJ2dldCcsICdlbnRyaWVzJywgJ2ZvckVhY2gnLCAndmFsdWVzJ10ucmVkdWNlKChyZXN1bHQsIHByb3BlcnR5KSA9PiB7XG5cdFx0cmVzdWx0W3Byb3BlcnR5XSA9IHtlbnVtZXJhYmxlOiB0cnVlfTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LCB7fSlcbik7XG5cbi8qKlxuICogQ3JlYXRlIGEgSGVhZGVycyBvYmplY3QgZnJvbSBhbiBodHRwLkluY29taW5nTWVzc2FnZS5yYXdIZWFkZXJzLCBpZ25vcmluZyB0aG9zZSB0aGF0IGRvXG4gKiBub3QgY29uZm9ybSB0byBIVFRQIGdyYW1tYXIgcHJvZHVjdGlvbnMuXG4gKiBAcGFyYW0ge2ltcG9ydCgnaHR0cCcpLkluY29taW5nTWVzc2FnZVsncmF3SGVhZGVycyddfSBoZWFkZXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUmF3SGVhZGVycyhoZWFkZXJzID0gW10pIHtcblx0cmV0dXJuIG5ldyBIZWFkZXJzKFxuXHRcdGhlYWRlcnNcblx0XHRcdC8vIFNwbGl0IGludG8gcGFpcnNcblx0XHRcdC5yZWR1Y2UoKHJlc3VsdCwgdmFsdWUsIGluZGV4LCBhcnJheSkgPT4ge1xuXHRcdFx0XHRpZiAoaW5kZXggJSAyID09PSAwKSB7XG5cdFx0XHRcdFx0cmVzdWx0LnB1c2goYXJyYXkuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH0sIFtdKVxuXHRcdFx0LmZpbHRlcigoW25hbWUsIHZhbHVlXSkgPT4ge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhbGlkYXRlSGVhZGVyTmFtZShuYW1lKTtcblx0XHRcdFx0XHR2YWxpZGF0ZUhlYWRlclZhbHVlKG5hbWUsIFN0cmluZyh2YWx1ZSkpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0KTtcbn1cbiIsICJjb25zdCByZWRpcmVjdFN0YXR1cyA9IG5ldyBTZXQoWzMwMSwgMzAyLCAzMDMsIDMwNywgMzA4XSk7XG5cbi8qKlxuICogUmVkaXJlY3QgY29kZSBtYXRjaGluZ1xuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlIC0gU3RhdHVzIGNvZGVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc1JlZGlyZWN0ID0gY29kZSA9PiB7XG5cdHJldHVybiByZWRpcmVjdFN0YXR1cy5oYXMoY29kZSk7XG59O1xuIiwgIi8qKlxuICogUmVzcG9uc2UuanNcbiAqXG4gKiBSZXNwb25zZSBjbGFzcyBwcm92aWRlcyBjb250ZW50IGRlY29kaW5nXG4gKi9cblxuaW1wb3J0IEhlYWRlcnMgZnJvbSAnLi9oZWFkZXJzLmpzJztcbmltcG9ydCBCb2R5LCB7Y2xvbmUsIGV4dHJhY3RDb250ZW50VHlwZX0gZnJvbSAnLi9ib2R5LmpzJztcbmltcG9ydCB7aXNSZWRpcmVjdH0gZnJvbSAnLi91dGlscy9pcy1yZWRpcmVjdC5qcyc7XG5cbmNvbnN0IElOVEVSTkFMUyA9IFN5bWJvbCgnUmVzcG9uc2UgaW50ZXJuYWxzJyk7XG5cbi8qKlxuICogUmVzcG9uc2UgY2xhc3NcbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNyZXNwb25zZS1jbGFzc1xuICpcbiAqIEBwYXJhbSAgIFN0cmVhbSAgYm9keSAgUmVhZGFibGUgc3RyZWFtXG4gKiBAcGFyYW0gICBPYmplY3QgIG9wdHMgIFJlc3BvbnNlIG9wdGlvbnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzcG9uc2UgZXh0ZW5kcyBCb2R5IHtcblx0Y29uc3RydWN0b3IoYm9keSA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuXHRcdHN1cGVyKGJvZHksIG9wdGlvbnMpO1xuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsIGVxZXFlcSwgbm8tbmVnYXRlZC1jb25kaXRpb25cblx0XHRjb25zdCBzdGF0dXMgPSBvcHRpb25zLnN0YXR1cyAhPSBudWxsID8gb3B0aW9ucy5zdGF0dXMgOiAyMDA7XG5cblx0XHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKTtcblxuXHRcdGlmIChib2R5ICE9PSBudWxsICYmICFoZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJykpIHtcblx0XHRcdGNvbnN0IGNvbnRlbnRUeXBlID0gZXh0cmFjdENvbnRlbnRUeXBlKGJvZHksIHRoaXMpO1xuXHRcdFx0aWYgKGNvbnRlbnRUeXBlKSB7XG5cdFx0XHRcdGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCBjb250ZW50VHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpc1tJTlRFUk5BTFNdID0ge1xuXHRcdFx0dHlwZTogJ2RlZmF1bHQnLFxuXHRcdFx0dXJsOiBvcHRpb25zLnVybCxcblx0XHRcdHN0YXR1cyxcblx0XHRcdHN0YXR1c1RleHQ6IG9wdGlvbnMuc3RhdHVzVGV4dCB8fCAnJyxcblx0XHRcdGhlYWRlcnMsXG5cdFx0XHRjb3VudGVyOiBvcHRpb25zLmNvdW50ZXIsXG5cdFx0XHRoaWdoV2F0ZXJNYXJrOiBvcHRpb25zLmhpZ2hXYXRlck1hcmtcblx0XHR9O1xuXHR9XG5cblx0Z2V0IHR5cGUoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS50eXBlO1xuXHR9XG5cblx0Z2V0IHVybCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnVybCB8fCAnJztcblx0fVxuXG5cdGdldCBzdGF0dXMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zdGF0dXM7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVuaWVuY2UgcHJvcGVydHkgcmVwcmVzZW50aW5nIGlmIHRoZSByZXF1ZXN0IGVuZGVkIG5vcm1hbGx5XG5cdCAqL1xuXHRnZXQgb2soKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zdGF0dXMgPj0gMjAwICYmIHRoaXNbSU5URVJOQUxTXS5zdGF0dXMgPCAzMDA7XG5cdH1cblxuXHRnZXQgcmVkaXJlY3RlZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLmNvdW50ZXIgPiAwO1xuXHR9XG5cblx0Z2V0IHN0YXR1c1RleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5zdGF0dXNUZXh0O1xuXHR9XG5cblx0Z2V0IGhlYWRlcnMoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5oZWFkZXJzO1xuXHR9XG5cblx0Z2V0IGhpZ2hXYXRlck1hcmsoKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5oaWdoV2F0ZXJNYXJrO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb25lIHRoaXMgcmVzcG9uc2Vcblx0ICpcblx0ICogQHJldHVybiAgUmVzcG9uc2Vcblx0ICovXG5cdGNsb25lKCkge1xuXHRcdHJldHVybiBuZXcgUmVzcG9uc2UoY2xvbmUodGhpcywgdGhpcy5oaWdoV2F0ZXJNYXJrKSwge1xuXHRcdFx0dHlwZTogdGhpcy50eXBlLFxuXHRcdFx0dXJsOiB0aGlzLnVybCxcblx0XHRcdHN0YXR1czogdGhpcy5zdGF0dXMsXG5cdFx0XHRzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG5cdFx0XHRoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG5cdFx0XHRvazogdGhpcy5vayxcblx0XHRcdHJlZGlyZWN0ZWQ6IHRoaXMucmVkaXJlY3RlZCxcblx0XHRcdHNpemU6IHRoaXMuc2l6ZSxcblx0XHRcdGhpZ2hXYXRlck1hcms6IHRoaXMuaGlnaFdhdGVyTWFya1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgICAgVGhlIFVSTCB0aGF0IHRoZSBuZXcgcmVzcG9uc2UgaXMgdG8gb3JpZ2luYXRlIGZyb20uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0dXMgQW4gb3B0aW9uYWwgc3RhdHVzIGNvZGUgZm9yIHRoZSByZXNwb25zZSAoZS5nLiwgMzAyLilcblx0ICogQHJldHVybnMge1Jlc3BvbnNlfSAgICBBIFJlc3BvbnNlIG9iamVjdC5cblx0ICovXG5cdHN0YXRpYyByZWRpcmVjdCh1cmwsIHN0YXR1cyA9IDMwMikge1xuXHRcdGlmICghaXNSZWRpcmVjdChzdGF0dXMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcignRmFpbGVkIHRvIGV4ZWN1dGUgXCJyZWRpcmVjdFwiIG9uIFwicmVzcG9uc2VcIjogSW52YWxpZCBzdGF0dXMgY29kZScpO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge1xuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRsb2NhdGlvbjogbmV3IFVSTCh1cmwpLnRvU3RyaW5nKClcblx0XHRcdH0sXG5cdFx0XHRzdGF0dXNcblx0XHR9KTtcblx0fVxuXG5cdHN0YXRpYyBlcnJvcigpIHtcblx0XHRjb25zdCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pO1xuXHRcdHJlc3BvbnNlW0lOVEVSTkFMU10udHlwZSA9ICdlcnJvcic7XG5cdFx0cmV0dXJuIHJlc3BvbnNlO1xuXHR9XG5cblx0c3RhdGljIGpzb24oZGF0YSA9IHVuZGVmaW5lZCwgaW5pdCA9IHt9KSB7XG5cdFx0Y29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG5cdFx0aWYgKGJvZHkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignZGF0YSBpcyBub3QgSlNPTiBzZXJpYWxpemFibGUnKTtcblx0XHR9XG5cblx0XHRjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5pdCAmJiBpbml0LmhlYWRlcnMpO1xuXG5cdFx0aWYgKCFoZWFkZXJzLmhhcygnY29udGVudC10eXBlJykpIHtcblx0XHRcdGhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgUmVzcG9uc2UoYm9keSwge1xuXHRcdFx0Li4uaW5pdCxcblx0XHRcdGhlYWRlcnNcblx0XHR9KTtcblx0fVxuXG5cdGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcblx0XHRyZXR1cm4gJ1Jlc3BvbnNlJztcblx0fVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZXNwb25zZS5wcm90b3R5cGUsIHtcblx0dHlwZToge2VudW1lcmFibGU6IHRydWV9LFxuXHR1cmw6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0c3RhdHVzOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdG9rOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHJlZGlyZWN0ZWQ6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0c3RhdHVzVGV4dDoge2VudW1lcmFibGU6IHRydWV9LFxuXHRoZWFkZXJzOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGNsb25lOiB7ZW51bWVyYWJsZTogdHJ1ZX1cbn0pO1xuIiwgIi8qKlxuICogUmVxdWVzdC5qc1xuICpcbiAqIFJlcXVlc3QgY2xhc3MgY29udGFpbnMgc2VydmVyIG9ubHkgb3B0aW9uc1xuICpcbiAqIEFsbCBzcGVjIGFsZ29yaXRobSBzdGVwIG51bWJlcnMgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnL2NvbW1pdC1zbmFwc2hvdHMvYWU3MTY4MjJjYjNhNjE4NDMyMjZjZDA5MGVlZmM2NTg5NDQ2YzFkMi8uXG4gKi9cblxuaW1wb3J0IHtmb3JtYXQgYXMgZm9ybWF0VXJsfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQge2RlcHJlY2F0ZX0gZnJvbSAnbm9kZTp1dGlsJztcbmltcG9ydCBIZWFkZXJzIGZyb20gJy4vaGVhZGVycy5qcyc7XG5pbXBvcnQgQm9keSwge2Nsb25lLCBleHRyYWN0Q29udGVudFR5cGUsIGdldFRvdGFsQnl0ZXN9IGZyb20gJy4vYm9keS5qcyc7XG5pbXBvcnQge2lzQWJvcnRTaWduYWx9IGZyb20gJy4vdXRpbHMvaXMuanMnO1xuaW1wb3J0IHtnZXRTZWFyY2h9IGZyb20gJy4vdXRpbHMvZ2V0LXNlYXJjaC5qcyc7XG5pbXBvcnQge1xuXHR2YWxpZGF0ZVJlZmVycmVyUG9saWN5LCBkZXRlcm1pbmVSZXF1ZXN0c1JlZmVycmVyLCBERUZBVUxUX1JFRkVSUkVSX1BPTElDWVxufSBmcm9tICcuL3V0aWxzL3JlZmVycmVyLmpzJztcblxuY29uc3QgSU5URVJOQUxTID0gU3ltYm9sKCdSZXF1ZXN0IGludGVybmFscycpO1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIGluc3RhbmNlIG9mIFJlcXVlc3QuXG4gKlxuICogQHBhcmFtICB7Kn0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5jb25zdCBpc1JlcXVlc3QgPSBvYmplY3QgPT4ge1xuXHRyZXR1cm4gKFxuXHRcdHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmXG5cdFx0dHlwZW9mIG9iamVjdFtJTlRFUk5BTFNdID09PSAnb2JqZWN0J1xuXHQpO1xufTtcblxuY29uc3QgZG9CYWREYXRhV2FybiA9IGRlcHJlY2F0ZSgoKSA9PiB7fSxcblx0Jy5kYXRhIGlzIG5vdCBhIHZhbGlkIFJlcXVlc3RJbml0IHByb3BlcnR5LCB1c2UgLmJvZHkgaW5zdGVhZCcsXG5cdCdodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL2lzc3Vlcy8xMDAwIChyZXF1ZXN0KScpO1xuXG4vKipcbiAqIFJlcXVlc3QgY2xhc3NcbiAqXG4gKiBSZWY6IGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNyZXF1ZXN0LWNsYXNzXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgICBpbnB1dCAgVXJsIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIE9iamVjdCAgaW5pdCAgIEN1c3RvbSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcXVlc3QgZXh0ZW5kcyBCb2R5IHtcblx0Y29uc3RydWN0b3IoaW5wdXQsIGluaXQgPSB7fSkge1xuXHRcdGxldCBwYXJzZWRVUkw7XG5cblx0XHQvLyBOb3JtYWxpemUgaW5wdXQgYW5kIGZvcmNlIFVSTCB0byBiZSBlbmNvZGVkIGFzIFVURi04IChodHRwczovL2dpdGh1Yi5jb20vbm9kZS1mZXRjaC9ub2RlLWZldGNoL2lzc3Vlcy8yNDUpXG5cdFx0aWYgKGlzUmVxdWVzdChpbnB1dCkpIHtcblx0XHRcdHBhcnNlZFVSTCA9IG5ldyBVUkwoaW5wdXQudXJsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyc2VkVVJMID0gbmV3IFVSTChpbnB1dCk7XG5cdFx0XHRpbnB1dCA9IHt9O1xuXHRcdH1cblxuXHRcdGlmIChwYXJzZWRVUkwudXNlcm5hbWUgIT09ICcnIHx8IHBhcnNlZFVSTC5wYXNzd29yZCAhPT0gJycpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYCR7cGFyc2VkVVJMfSBpcyBhbiB1cmwgd2l0aCBlbWJlZGRlZCBjcmVkZW50aWFscy5gKTtcblx0XHR9XG5cblx0XHRsZXQgbWV0aG9kID0gaW5pdC5tZXRob2QgfHwgaW5wdXQubWV0aG9kIHx8ICdHRVQnO1xuXHRcdGlmICgvXihkZWxldGV8Z2V0fGhlYWR8b3B0aW9uc3xwb3N0fHB1dCkkL2kudGVzdChtZXRob2QpKSB7XG5cdFx0XHRtZXRob2QgPSBtZXRob2QudG9VcHBlckNhc2UoKTtcblx0XHR9XG5cblx0XHRpZiAoIWlzUmVxdWVzdChpbml0KSAmJiAnZGF0YScgaW4gaW5pdCkge1xuXHRcdFx0ZG9CYWREYXRhV2FybigpO1xuXHRcdH1cblxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lcS1udWxsLCBlcWVxZXFcblx0XHRpZiAoKGluaXQuYm9keSAhPSBudWxsIHx8IChpc1JlcXVlc3QoaW5wdXQpICYmIGlucHV0LmJvZHkgIT09IG51bGwpKSAmJlxuXHRcdFx0KG1ldGhvZCA9PT0gJ0dFVCcgfHwgbWV0aG9kID09PSAnSEVBRCcpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdSZXF1ZXN0IHdpdGggR0VUL0hFQUQgbWV0aG9kIGNhbm5vdCBoYXZlIGJvZHknKTtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dEJvZHkgPSBpbml0LmJvZHkgP1xuXHRcdFx0aW5pdC5ib2R5IDpcblx0XHRcdChpc1JlcXVlc3QoaW5wdXQpICYmIGlucHV0LmJvZHkgIT09IG51bGwgP1xuXHRcdFx0XHRjbG9uZShpbnB1dCkgOlxuXHRcdFx0XHRudWxsKTtcblxuXHRcdHN1cGVyKGlucHV0Qm9keSwge1xuXHRcdFx0c2l6ZTogaW5pdC5zaXplIHx8IGlucHV0LnNpemUgfHwgMFxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKGluaXQuaGVhZGVycyB8fCBpbnB1dC5oZWFkZXJzIHx8IHt9KTtcblxuXHRcdGlmIChpbnB1dEJvZHkgIT09IG51bGwgJiYgIWhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKSkge1xuXHRcdFx0Y29uc3QgY29udGVudFR5cGUgPSBleHRyYWN0Q29udGVudFR5cGUoaW5wdXRCb2R5LCB0aGlzKTtcblx0XHRcdGlmIChjb250ZW50VHlwZSkge1xuXHRcdFx0XHRoZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBzaWduYWwgPSBpc1JlcXVlc3QoaW5wdXQpID9cblx0XHRcdGlucHV0LnNpZ25hbCA6XG5cdFx0XHRudWxsO1xuXHRcdGlmICgnc2lnbmFsJyBpbiBpbml0KSB7XG5cdFx0XHRzaWduYWwgPSBpbml0LnNpZ25hbDtcblx0XHR9XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxXG5cdFx0aWYgKHNpZ25hbCAhPSBudWxsICYmICFpc0Fib3J0U2lnbmFsKHNpZ25hbCkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHNpZ25hbCB0byBiZSBhbiBpbnN0YW5jZW9mIEFib3J0U2lnbmFsIG9yIEV2ZW50VGFyZ2V0Jyk7XG5cdFx0fVxuXG5cdFx0Ly8gXHUwMEE3NS40LCBSZXF1ZXN0IGNvbnN0cnVjdG9yIHN0ZXBzLCBzdGVwIDE1LjFcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCwgZXFlcWVxXG5cdFx0bGV0IHJlZmVycmVyID0gaW5pdC5yZWZlcnJlciA9PSBudWxsID8gaW5wdXQucmVmZXJyZXIgOiBpbml0LnJlZmVycmVyO1xuXHRcdGlmIChyZWZlcnJlciA9PT0gJycpIHtcblx0XHRcdC8vIFx1MDBBNzUuNCwgUmVxdWVzdCBjb25zdHJ1Y3RvciBzdGVwcywgc3RlcCAxNS4yXG5cdFx0XHRyZWZlcnJlciA9ICduby1yZWZlcnJlcic7XG5cdFx0fSBlbHNlIGlmIChyZWZlcnJlcikge1xuXHRcdFx0Ly8gXHUwMEE3NS40LCBSZXF1ZXN0IGNvbnN0cnVjdG9yIHN0ZXBzLCBzdGVwIDE1LjMuMSwgMTUuMy4yXG5cdFx0XHRjb25zdCBwYXJzZWRSZWZlcnJlciA9IG5ldyBVUkwocmVmZXJyZXIpO1xuXHRcdFx0Ly8gXHUwMEE3NS40LCBSZXF1ZXN0IGNvbnN0cnVjdG9yIHN0ZXBzLCBzdGVwIDE1LjMuMywgMTUuMy40XG5cdFx0XHRyZWZlcnJlciA9IC9eYWJvdXQ6KFxcL1xcLyk/Y2xpZW50JC8udGVzdChwYXJzZWRSZWZlcnJlcikgPyAnY2xpZW50JyA6IHBhcnNlZFJlZmVycmVyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZWZlcnJlciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR0aGlzW0lOVEVSTkFMU10gPSB7XG5cdFx0XHRtZXRob2QsXG5cdFx0XHRyZWRpcmVjdDogaW5pdC5yZWRpcmVjdCB8fCBpbnB1dC5yZWRpcmVjdCB8fCAnZm9sbG93Jyxcblx0XHRcdGhlYWRlcnMsXG5cdFx0XHRwYXJzZWRVUkwsXG5cdFx0XHRzaWduYWwsXG5cdFx0XHRyZWZlcnJlclxuXHRcdH07XG5cblx0XHQvLyBOb2RlLWZldGNoLW9ubHkgb3B0aW9uc1xuXHRcdHRoaXMuZm9sbG93ID0gaW5pdC5mb2xsb3cgPT09IHVuZGVmaW5lZCA/IChpbnB1dC5mb2xsb3cgPT09IHVuZGVmaW5lZCA/IDIwIDogaW5wdXQuZm9sbG93KSA6IGluaXQuZm9sbG93O1xuXHRcdHRoaXMuY29tcHJlc3MgPSBpbml0LmNvbXByZXNzID09PSB1bmRlZmluZWQgPyAoaW5wdXQuY29tcHJlc3MgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBpbnB1dC5jb21wcmVzcykgOiBpbml0LmNvbXByZXNzO1xuXHRcdHRoaXMuY291bnRlciA9IGluaXQuY291bnRlciB8fCBpbnB1dC5jb3VudGVyIHx8IDA7XG5cdFx0dGhpcy5hZ2VudCA9IGluaXQuYWdlbnQgfHwgaW5wdXQuYWdlbnQ7XG5cdFx0dGhpcy5oaWdoV2F0ZXJNYXJrID0gaW5pdC5oaWdoV2F0ZXJNYXJrIHx8IGlucHV0LmhpZ2hXYXRlck1hcmsgfHwgMTYzODQ7XG5cdFx0dGhpcy5pbnNlY3VyZUhUVFBQYXJzZXIgPSBpbml0Lmluc2VjdXJlSFRUUFBhcnNlciB8fCBpbnB1dC5pbnNlY3VyZUhUVFBQYXJzZXIgfHwgZmFsc2U7XG5cblx0XHQvLyBcdTAwQTc1LjQsIFJlcXVlc3QgY29uc3RydWN0b3Igc3RlcHMsIHN0ZXAgMTYuXG5cdFx0Ly8gRGVmYXVsdCBpcyBlbXB0eSBzdHJpbmcgcGVyIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjb25jZXB0LXJlcXVlc3QtcmVmZXJyZXItcG9saWN5XG5cdFx0dGhpcy5yZWZlcnJlclBvbGljeSA9IGluaXQucmVmZXJyZXJQb2xpY3kgfHwgaW5wdXQucmVmZXJyZXJQb2xpY3kgfHwgJyc7XG5cdH1cblxuXHQvKiogQHJldHVybnMge3N0cmluZ30gKi9cblx0Z2V0IG1ldGhvZCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLm1ldGhvZDtcblx0fVxuXG5cdC8qKiBAcmV0dXJucyB7c3RyaW5nfSAqL1xuXHRnZXQgdXJsKCkge1xuXHRcdHJldHVybiBmb3JtYXRVcmwodGhpc1tJTlRFUk5BTFNdLnBhcnNlZFVSTCk7XG5cdH1cblxuXHQvKiogQHJldHVybnMge0hlYWRlcnN9ICovXG5cdGdldCBoZWFkZXJzKCkge1xuXHRcdHJldHVybiB0aGlzW0lOVEVSTkFMU10uaGVhZGVycztcblx0fVxuXG5cdGdldCByZWRpcmVjdCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnJlZGlyZWN0O1xuXHR9XG5cblx0LyoqIEByZXR1cm5zIHtBYm9ydFNpZ25hbH0gKi9cblx0Z2V0IHNpZ25hbCgpIHtcblx0XHRyZXR1cm4gdGhpc1tJTlRFUk5BTFNdLnNpZ25hbDtcblx0fVxuXG5cdC8vIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNkb20tcmVxdWVzdC1yZWZlcnJlclxuXHRnZXQgcmVmZXJyZXIoKSB7XG5cdFx0aWYgKHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlciA9PT0gJ25vLXJlZmVycmVyJykge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzW0lOVEVSTkFMU10ucmVmZXJyZXIgPT09ICdjbGllbnQnKSB7XG5cdFx0XHRyZXR1cm4gJ2Fib3V0OmNsaWVudCc7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlcikge1xuXHRcdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlci50b1N0cmluZygpO1xuXHRcdH1cblxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHRnZXQgcmVmZXJyZXJQb2xpY3koKSB7XG5cdFx0cmV0dXJuIHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlclBvbGljeTtcblx0fVxuXG5cdHNldCByZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSkge1xuXHRcdHRoaXNbSU5URVJOQUxTXS5yZWZlcnJlclBvbGljeSA9IHZhbGlkYXRlUmVmZXJyZXJQb2xpY3kocmVmZXJyZXJQb2xpY3kpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb25lIHRoaXMgcmVxdWVzdFxuXHQgKlxuXHQgKiBAcmV0dXJuICBSZXF1ZXN0XG5cdCAqL1xuXHRjbG9uZSgpIHtcblx0XHRyZXR1cm4gbmV3IFJlcXVlc3QodGhpcyk7XG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuICdSZXF1ZXN0Jztcblx0fVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhSZXF1ZXN0LnByb3RvdHlwZSwge1xuXHRtZXRob2Q6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0dXJsOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdGhlYWRlcnM6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0cmVkaXJlY3Q6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0Y2xvbmU6IHtlbnVtZXJhYmxlOiB0cnVlfSxcblx0c2lnbmFsOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHJlZmVycmVyOiB7ZW51bWVyYWJsZTogdHJ1ZX0sXG5cdHJlZmVycmVyUG9saWN5OiB7ZW51bWVyYWJsZTogdHJ1ZX1cbn0pO1xuXG4vKipcbiAqIENvbnZlcnQgYSBSZXF1ZXN0IHRvIE5vZGUuanMgaHR0cCByZXF1ZXN0IG9wdGlvbnMuXG4gKlxuICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0IC0gQSBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcmV0dXJuIFRoZSBvcHRpb25zIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gaHR0cC5yZXF1ZXN0XG4gKi9cbmV4cG9ydCBjb25zdCBnZXROb2RlUmVxdWVzdE9wdGlvbnMgPSByZXF1ZXN0ID0+IHtcblx0Y29uc3Qge3BhcnNlZFVSTH0gPSByZXF1ZXN0W0lOVEVSTkFMU107XG5cdGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhyZXF1ZXN0W0lOVEVSTkFMU10uaGVhZGVycyk7XG5cblx0Ly8gRmV0Y2ggc3RlcCAxLjNcblx0aWYgKCFoZWFkZXJzLmhhcygnQWNjZXB0JykpIHtcblx0XHRoZWFkZXJzLnNldCgnQWNjZXB0JywgJyovKicpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoIHN0ZXBzIDIuNC0yLjdcblx0bGV0IGNvbnRlbnRMZW5ndGhWYWx1ZSA9IG51bGw7XG5cdGlmIChyZXF1ZXN0LmJvZHkgPT09IG51bGwgJiYgL14ocG9zdHxwdXQpJC9pLnRlc3QocmVxdWVzdC5tZXRob2QpKSB7XG5cdFx0Y29udGVudExlbmd0aFZhbHVlID0gJzAnO1xuXHR9XG5cblx0aWYgKHJlcXVlc3QuYm9keSAhPT0gbnVsbCkge1xuXHRcdGNvbnN0IHRvdGFsQnl0ZXMgPSBnZXRUb3RhbEJ5dGVzKHJlcXVlc3QpO1xuXHRcdC8vIFNldCBDb250ZW50LUxlbmd0aCBpZiB0b3RhbEJ5dGVzIGlzIGEgbnVtYmVyICh0aGF0IGlzIG5vdCBOYU4pXG5cdFx0aWYgKHR5cGVvZiB0b3RhbEJ5dGVzID09PSAnbnVtYmVyJyAmJiAhTnVtYmVyLmlzTmFOKHRvdGFsQnl0ZXMpKSB7XG5cdFx0XHRjb250ZW50TGVuZ3RoVmFsdWUgPSBTdHJpbmcodG90YWxCeXRlcyk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGNvbnRlbnRMZW5ndGhWYWx1ZSkge1xuXHRcdGhlYWRlcnMuc2V0KCdDb250ZW50LUxlbmd0aCcsIGNvbnRlbnRMZW5ndGhWYWx1ZSk7XG5cdH1cblxuXHQvLyA0LjEuIE1haW4gZmV0Y2gsIHN0ZXAgMi42XG5cdC8vID4gSWYgcmVxdWVzdCdzIHJlZmVycmVyIHBvbGljeSBpcyB0aGUgZW1wdHkgc3RyaW5nLCB0aGVuIHNldCByZXF1ZXN0J3MgcmVmZXJyZXIgcG9saWN5IHRvIHRoZVxuXHQvLyA+IGRlZmF1bHQgcmVmZXJyZXIgcG9saWN5LlxuXHRpZiAocmVxdWVzdC5yZWZlcnJlclBvbGljeSA9PT0gJycpIHtcblx0XHRyZXF1ZXN0LnJlZmVycmVyUG9saWN5ID0gREVGQVVMVF9SRUZFUlJFUl9QT0xJQ1k7XG5cdH1cblxuXHQvLyA0LjEuIE1haW4gZmV0Y2gsIHN0ZXAgMi43XG5cdC8vID4gSWYgcmVxdWVzdCdzIHJlZmVycmVyIGlzIG5vdCBcIm5vLXJlZmVycmVyXCIsIHNldCByZXF1ZXN0J3MgcmVmZXJyZXIgdG8gdGhlIHJlc3VsdCBvZiBpbnZva2luZ1xuXHQvLyA+IGRldGVybWluZSByZXF1ZXN0J3MgcmVmZXJyZXIuXG5cdGlmIChyZXF1ZXN0LnJlZmVycmVyICYmIHJlcXVlc3QucmVmZXJyZXIgIT09ICduby1yZWZlcnJlcicpIHtcblx0XHRyZXF1ZXN0W0lOVEVSTkFMU10ucmVmZXJyZXIgPSBkZXRlcm1pbmVSZXF1ZXN0c1JlZmVycmVyKHJlcXVlc3QpO1xuXHR9IGVsc2Uge1xuXHRcdHJlcXVlc3RbSU5URVJOQUxTXS5yZWZlcnJlciA9ICduby1yZWZlcnJlcic7XG5cdH1cblxuXHQvLyA0LjUuIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCwgc3RlcCA2Ljlcblx0Ly8gPiBJZiBodHRwUmVxdWVzdCdzIHJlZmVycmVyIGlzIGEgVVJMLCB0aGVuIGFwcGVuZCBgUmVmZXJlcmAvaHR0cFJlcXVlc3QncyByZWZlcnJlciwgc2VyaWFsaXplZFxuXHQvLyA+ICBhbmQgaXNvbW9ycGhpYyBlbmNvZGVkLCB0byBodHRwUmVxdWVzdCdzIGhlYWRlciBsaXN0LlxuXHRpZiAocmVxdWVzdFtJTlRFUk5BTFNdLnJlZmVycmVyIGluc3RhbmNlb2YgVVJMKSB7XG5cdFx0aGVhZGVycy5zZXQoJ1JlZmVyZXInLCByZXF1ZXN0LnJlZmVycmVyKTtcblx0fVxuXG5cdC8vIEhUVFAtbmV0d29yay1vci1jYWNoZSBmZXRjaCBzdGVwIDIuMTFcblx0aWYgKCFoZWFkZXJzLmhhcygnVXNlci1BZ2VudCcpKSB7XG5cdFx0aGVhZGVycy5zZXQoJ1VzZXItQWdlbnQnLCAnbm9kZS1mZXRjaCcpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrLW9yLWNhY2hlIGZldGNoIHN0ZXAgMi4xNVxuXHRpZiAocmVxdWVzdC5jb21wcmVzcyAmJiAhaGVhZGVycy5oYXMoJ0FjY2VwdC1FbmNvZGluZycpKSB7XG5cdFx0aGVhZGVycy5zZXQoJ0FjY2VwdC1FbmNvZGluZycsICdnemlwLCBkZWZsYXRlLCBicicpO1xuXHR9XG5cblx0bGV0IHthZ2VudH0gPSByZXF1ZXN0O1xuXHRpZiAodHlwZW9mIGFnZW50ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0YWdlbnQgPSBhZ2VudChwYXJzZWRVUkwpO1xuXHR9XG5cblx0Ly8gSFRUUC1uZXR3b3JrIGZldGNoIHN0ZXAgNC4yXG5cdC8vIGNodW5rZWQgZW5jb2RpbmcgaXMgaGFuZGxlZCBieSBOb2RlLmpzXG5cblx0Y29uc3Qgc2VhcmNoID0gZ2V0U2VhcmNoKHBhcnNlZFVSTCk7XG5cblx0Ly8gUGFzcyB0aGUgZnVsbCBVUkwgZGlyZWN0bHkgdG8gcmVxdWVzdCgpLCBidXQgb3ZlcndyaXRlIHRoZSBmb2xsb3dpbmdcblx0Ly8gb3B0aW9uczpcblx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHQvLyBPdmVyd3JpdGUgc2VhcmNoIHRvIHJldGFpbiB0cmFpbGluZyA/IChpc3N1ZSAjNzc2KVxuXHRcdHBhdGg6IHBhcnNlZFVSTC5wYXRobmFtZSArIHNlYXJjaCxcblx0XHQvLyBUaGUgZm9sbG93aW5nIG9wdGlvbnMgYXJlIG5vdCBleHByZXNzZWQgaW4gdGhlIFVSTFxuXHRcdG1ldGhvZDogcmVxdWVzdC5tZXRob2QsXG5cdFx0aGVhZGVyczogaGVhZGVyc1tTeW1ib2wuZm9yKCdub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbScpXSgpLFxuXHRcdGluc2VjdXJlSFRUUFBhcnNlcjogcmVxdWVzdC5pbnNlY3VyZUhUVFBQYXJzZXIsXG5cdFx0YWdlbnRcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdC8qKiBAdHlwZSB7VVJMfSAqL1xuXHRcdHBhcnNlZFVSTCxcblx0XHRvcHRpb25zXG5cdH07XG59O1xuIiwgImV4cG9ydCBjb25zdCBnZXRTZWFyY2ggPSBwYXJzZWRVUkwgPT4ge1xuXHRpZiAocGFyc2VkVVJMLnNlYXJjaCkge1xuXHRcdHJldHVybiBwYXJzZWRVUkwuc2VhcmNoO1xuXHR9XG5cblx0Y29uc3QgbGFzdE9mZnNldCA9IHBhcnNlZFVSTC5ocmVmLmxlbmd0aCAtIDE7XG5cdGNvbnN0IGhhc2ggPSBwYXJzZWRVUkwuaGFzaCB8fCAocGFyc2VkVVJMLmhyZWZbbGFzdE9mZnNldF0gPT09ICcjJyA/ICcjJyA6ICcnKTtcblx0cmV0dXJuIHBhcnNlZFVSTC5ocmVmW2xhc3RPZmZzZXQgLSBoYXNoLmxlbmd0aF0gPT09ICc/JyA/ICc/JyA6ICcnO1xufTtcbiIsICJpbXBvcnQge2lzSVB9IGZyb20gJ25vZGU6bmV0JztcblxuLyoqXG4gKiBAZXh0ZXJuYWwgVVJMXG4gKiBAc2VlIHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvVVJMfFVSTH1cbiAqL1xuXG4vKipcbiAqIEBtb2R1bGUgdXRpbHMvcmVmZXJyZXJcbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jc3RyaXAtdXJsfFJlZmVycmVyIFBvbGljeSBcdTAwQTc4LjQuIFN0cmlwIHVybCBmb3IgdXNlIGFzIGEgcmVmZXJyZXJ9XG4gKiBAcGFyYW0ge3N0cmluZ30gVVJMXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcmlnaW5Pbmx5PWZhbHNlXVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaXBVUkxGb3JVc2VBc0FSZWZlcnJlcih1cmwsIG9yaWdpbk9ubHkgPSBmYWxzZSkge1xuXHQvLyAxLiBJZiB1cmwgaXMgbnVsbCwgcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRpZiAodXJsID09IG51bGwpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lcS1udWxsLCBlcWVxZXFcblx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0fVxuXG5cdHVybCA9IG5ldyBVUkwodXJsKTtcblxuXHQvLyAyLiBJZiB1cmwncyBzY2hlbWUgaXMgYSBsb2NhbCBzY2hlbWUsIHRoZW4gcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRpZiAoL14oYWJvdXR8YmxvYnxkYXRhKTokLy50ZXN0KHVybC5wcm90b2NvbCkpIHtcblx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0fVxuXG5cdC8vIDMuIFNldCB1cmwncyB1c2VybmFtZSB0byB0aGUgZW1wdHkgc3RyaW5nLlxuXHR1cmwudXNlcm5hbWUgPSAnJztcblxuXHQvLyA0LiBTZXQgdXJsJ3MgcGFzc3dvcmQgdG8gbnVsbC5cblx0Ly8gTm90ZTogYG51bGxgIGFwcGVhcnMgdG8gYmUgYSBtaXN0YWtlIGFzIHRoaXMgYWN0dWFsbHkgcmVzdWx0cyBpbiB0aGUgcGFzc3dvcmQgYmVpbmcgYFwibnVsbFwiYC5cblx0dXJsLnBhc3N3b3JkID0gJyc7XG5cblx0Ly8gNS4gU2V0IHVybCdzIGZyYWdtZW50IHRvIG51bGwuXG5cdC8vIE5vdGU6IGBudWxsYCBhcHBlYXJzIHRvIGJlIGEgbWlzdGFrZSBhcyB0aGlzIGFjdHVhbGx5IHJlc3VsdHMgaW4gdGhlIGZyYWdtZW50IGJlaW5nIGBcIiNudWxsXCJgLlxuXHR1cmwuaGFzaCA9ICcnO1xuXG5cdC8vIDYuIElmIHRoZSBvcmlnaW4tb25seSBmbGFnIGlzIHRydWUsIHRoZW46XG5cdGlmIChvcmlnaW5Pbmx5KSB7XG5cdFx0Ly8gNi4xLiBTZXQgdXJsJ3MgcGF0aCB0byBudWxsLlxuXHRcdC8vIE5vdGU6IGBudWxsYCBhcHBlYXJzIHRvIGJlIGEgbWlzdGFrZSBhcyB0aGlzIGFjdHVhbGx5IHJlc3VsdHMgaW4gdGhlIHBhdGggYmVpbmcgYFwiL251bGxcImAuXG5cdFx0dXJsLnBhdGhuYW1lID0gJyc7XG5cblx0XHQvLyA2LjIuIFNldCB1cmwncyBxdWVyeSB0byBudWxsLlxuXHRcdC8vIE5vdGU6IGBudWxsYCBhcHBlYXJzIHRvIGJlIGEgbWlzdGFrZSBhcyB0aGlzIGFjdHVhbGx5IHJlc3VsdHMgaW4gdGhlIHF1ZXJ5IGJlaW5nIGBcIj9udWxsXCJgLlxuXHRcdHVybC5zZWFyY2ggPSAnJztcblx0fVxuXG5cdC8vIDcuIFJldHVybiB1cmwuXG5cdHJldHVybiB1cmw7XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI2VudW1kZWYtcmVmZXJyZXJwb2xpY3l8ZW51bSBSZWZlcnJlclBvbGljeX1cbiAqL1xuZXhwb3J0IGNvbnN0IFJlZmVycmVyUG9saWN5ID0gbmV3IFNldChbXG5cdCcnLFxuXHQnbm8tcmVmZXJyZXInLFxuXHQnbm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGUnLFxuXHQnc2FtZS1vcmlnaW4nLFxuXHQnb3JpZ2luJyxcblx0J3N0cmljdC1vcmlnaW4nLFxuXHQnb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJyxcblx0J3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nLFxuXHQndW5zYWZlLXVybCdcbl0pO1xuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNkZWZhdWx0LXJlZmVycmVyLXBvbGljeXxkZWZhdWx0IHJlZmVycmVyIHBvbGljeX1cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVGRVJSRVJfUE9MSUNZID0gJ3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nO1xuXG4vKipcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNyZWZlcnJlci1wb2xpY2llc3xSZWZlcnJlciBQb2xpY3kgXHUwMEE3My4gUmVmZXJyZXIgUG9saWNpZXN9XG4gKiBAcGFyYW0ge3N0cmluZ30gcmVmZXJyZXJQb2xpY3lcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHJlZmVycmVyUG9saWN5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KSB7XG5cdGlmICghUmVmZXJyZXJQb2xpY3kuaGFzKHJlZmVycmVyUG9saWN5KSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgcmVmZXJyZXJQb2xpY3k6ICR7cmVmZXJyZXJQb2xpY3l9YCk7XG5cdH1cblxuXHRyZXR1cm4gcmVmZXJyZXJQb2xpY3k7XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1zZWN1cmUtY29udGV4dHMvI2lzLW9yaWdpbi10cnVzdHdvcnRoeXxSZWZlcnJlciBQb2xpY3kgXHUwMEE3My4yLiBJcyBvcmlnaW4gcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHk/fVxuICogQHBhcmFtIHtleHRlcm5hbDpVUkx9IHVybFxuICogQHJldHVybnMgYHRydWVgOiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIsIGBmYWxzZWA6IFwiTm90IFRydXN0d29ydGh5XCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT3JpZ2luUG90ZW50aWFsbHlUcnVzdHdvcnRoeSh1cmwpIHtcblx0Ly8gMS4gSWYgb3JpZ2luIGlzIGFuIG9wYXF1ZSBvcmlnaW4sIHJldHVybiBcIk5vdCBUcnVzdHdvcnRoeVwiLlxuXHQvLyBOb3QgYXBwbGljYWJsZVxuXG5cdC8vIDIuIEFzc2VydDogb3JpZ2luIGlzIGEgdHVwbGUgb3JpZ2luLlxuXHQvLyBOb3QgZm9yIGltcGxlbWVudGF0aW9uc1xuXG5cdC8vIDMuIElmIG9yaWdpbidzIHNjaGVtZSBpcyBlaXRoZXIgXCJodHRwc1wiIG9yIFwid3NzXCIsIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdGlmICgvXihodHRwfHdzKXM6JC8udGVzdCh1cmwucHJvdG9jb2wpKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyA0LiBJZiBvcmlnaW4ncyBob3N0IGNvbXBvbmVudCBtYXRjaGVzIG9uZSBvZiB0aGUgQ0lEUiBub3RhdGlvbnMgMTI3LjAuMC4wLzggb3IgOjoxLzEyOCBbUkZDNDYzMl0sIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdGNvbnN0IGhvc3RJcCA9IHVybC5ob3N0LnJlcGxhY2UoLyheXFxbKXwoXSQpL2csICcnKTtcblx0Y29uc3QgaG9zdElQVmVyc2lvbiA9IGlzSVAoaG9zdElwKTtcblxuXHRpZiAoaG9zdElQVmVyc2lvbiA9PT0gNCAmJiAvXjEyN1xcLi8udGVzdChob3N0SXApKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAoaG9zdElQVmVyc2lvbiA9PT0gNiAmJiAvXigoKDArOil7N30pfCg6OigwKzopezAsNn0pKTAqMSQvLnRlc3QoaG9zdElwKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gNS4gSWYgb3JpZ2luJ3MgaG9zdCBjb21wb25lbnQgaXMgXCJsb2NhbGhvc3RcIiBvciBmYWxscyB3aXRoaW4gXCIubG9jYWxob3N0XCIsIGFuZCB0aGUgdXNlciBhZ2VudCBjb25mb3JtcyB0byB0aGUgbmFtZSByZXNvbHV0aW9uIHJ1bGVzIGluIFtsZXQtbG9jYWxob3N0LWJlLWxvY2FsaG9zdF0sIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdC8vIFdlIGFyZSByZXR1cm5pbmcgRkFMU0UgaGVyZSBiZWNhdXNlIHdlIGNhbm5vdCBlbnN1cmUgY29uZm9ybWFuY2UgdG9cblx0Ly8gbGV0LWxvY2FsaG9zdC1iZS1sb2FsaG9zdCAoaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL2RyYWZ0LXdlc3QtbGV0LWxvY2FsaG9zdC1iZS1sb2NhbGhvc3QpXG5cdGlmICh1cmwuaG9zdCA9PT0gJ2xvY2FsaG9zdCcgfHwgdXJsLmhvc3QuZW5kc1dpdGgoJy5sb2NhbGhvc3QnKSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIDYuIElmIG9yaWdpbidzIHNjaGVtZSBjb21wb25lbnQgaXMgZmlsZSwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0aWYgKHVybC5wcm90b2NvbCA9PT0gJ2ZpbGU6Jykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gNy4gSWYgb3JpZ2luJ3Mgc2NoZW1lIGNvbXBvbmVudCBpcyBvbmUgd2hpY2ggdGhlIHVzZXIgYWdlbnQgY29uc2lkZXJzIHRvIGJlIGF1dGhlbnRpY2F0ZWQsIHJldHVybiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIuXG5cdC8vIE5vdCBzdXBwb3J0ZWRcblxuXHQvLyA4LiBJZiBvcmlnaW4gaGFzIGJlZW4gY29uZmlndXJlZCBhcyBhIHRydXN0d29ydGh5IG9yaWdpbiwgcmV0dXJuIFwiUG90ZW50aWFsbHkgVHJ1c3R3b3J0aHlcIi5cblx0Ly8gTm90IHN1cHBvcnRlZFxuXG5cdC8vIDkuIFJldHVybiBcIk5vdCBUcnVzdHdvcnRoeVwiLlxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1zZWN1cmUtY29udGV4dHMvI2lzLXVybC10cnVzdHdvcnRoeXxSZWZlcnJlciBQb2xpY3kgXHUwMEE3My4zLiBJcyB1cmwgcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHk/fVxuICogQHBhcmFtIHtleHRlcm5hbDpVUkx9IHVybFxuICogQHJldHVybnMgYHRydWVgOiBcIlBvdGVudGlhbGx5IFRydXN0d29ydGh5XCIsIGBmYWxzZWA6IFwiTm90IFRydXN0d29ydGh5XCJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeSh1cmwpIHtcblx0Ly8gMS4gSWYgdXJsIGlzIFwiYWJvdXQ6YmxhbmtcIiBvciBcImFib3V0OnNyY2RvY1wiLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHRpZiAoL15hYm91dDooYmxhbmt8c3JjZG9jKSQvLnRlc3QodXJsKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gMi4gSWYgdXJsJ3Mgc2NoZW1lIGlzIFwiZGF0YVwiLCByZXR1cm4gXCJQb3RlbnRpYWxseSBUcnVzdHdvcnRoeVwiLlxuXHRpZiAodXJsLnByb3RvY29sID09PSAnZGF0YTonKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvLyBOb3RlOiBUaGUgb3JpZ2luIG9mIGJsb2I6IGFuZCBmaWxlc3lzdGVtOiBVUkxzIGlzIHRoZSBvcmlnaW4gb2YgdGhlIGNvbnRleHQgaW4gd2hpY2ggdGhleSB3ZXJlXG5cdC8vIGNyZWF0ZWQuIFRoZXJlZm9yZSwgYmxvYnMgY3JlYXRlZCBpbiBhIHRydXN0d29ydGh5IG9yaWdpbiB3aWxsIHRoZW1zZWx2ZXMgYmUgcG90ZW50aWFsbHlcblx0Ly8gdHJ1c3R3b3J0aHkuXG5cdGlmICgvXihibG9ifGZpbGVzeXN0ZW0pOiQvLnRlc3QodXJsLnByb3RvY29sKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gMy4gUmV0dXJuIHRoZSByZXN1bHQgb2YgZXhlY3V0aW5nIFx1MDBBNzMuMiBJcyBvcmlnaW4gcG90ZW50aWFsbHkgdHJ1c3R3b3J0aHk/IG9uIHVybCdzIG9yaWdpbi5cblx0cmV0dXJuIGlzT3JpZ2luUG90ZW50aWFsbHlUcnVzdHdvcnRoeSh1cmwpO1xufVxuXG4vKipcbiAqIE1vZGlmaWVzIHRoZSByZWZlcnJlclVSTCB0byBlbmZvcmNlIGFueSBleHRyYSBzZWN1cml0eSBwb2xpY3kgY29uc2lkZXJhdGlvbnMuXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jZGV0ZXJtaW5lLXJlcXVlc3RzLXJlZmVycmVyfFJlZmVycmVyIFBvbGljeSBcdTAwQTc4LjMuIERldGVybWluZSByZXF1ZXN0J3MgUmVmZXJyZXJ9LCBzdGVwIDdcbiAqIEBjYWxsYmFjayBtb2R1bGU6dXRpbHMvcmVmZXJyZXJ+cmVmZXJyZXJVUkxDYWxsYmFja1xuICogQHBhcmFtIHtleHRlcm5hbDpVUkx9IHJlZmVycmVyVVJMXG4gKiBAcmV0dXJucyB7ZXh0ZXJuYWw6VVJMfSBtb2RpZmllZCByZWZlcnJlclVSTFxuICovXG5cbi8qKlxuICogTW9kaWZpZXMgdGhlIHJlZmVycmVyT3JpZ2luIHRvIGVuZm9yY2UgYW55IGV4dHJhIHNlY3VyaXR5IHBvbGljeSBjb25zaWRlcmF0aW9ucy5cbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby93ZWJhcHBzZWMtcmVmZXJyZXItcG9saWN5LyNkZXRlcm1pbmUtcmVxdWVzdHMtcmVmZXJyZXJ8UmVmZXJyZXIgUG9saWN5IFx1MDBBNzguMy4gRGV0ZXJtaW5lIHJlcXVlc3QncyBSZWZlcnJlcn0sIHN0ZXAgN1xuICogQGNhbGxiYWNrIG1vZHVsZTp1dGlscy9yZWZlcnJlcn5yZWZlcnJlck9yaWdpbkNhbGxiYWNrXG4gKiBAcGFyYW0ge2V4dGVybmFsOlVSTH0gcmVmZXJyZXJPcmlnaW5cbiAqIEByZXR1cm5zIHtleHRlcm5hbDpVUkx9IG1vZGlmaWVkIHJlZmVycmVyT3JpZ2luXG4gKi9cblxuLyoqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vd2ViYXBwc2VjLXJlZmVycmVyLXBvbGljeS8jZGV0ZXJtaW5lLXJlcXVlc3RzLXJlZmVycmVyfFJlZmVycmVyIFBvbGljeSBcdTAwQTc4LjMuIERldGVybWluZSByZXF1ZXN0J3MgUmVmZXJyZXJ9XG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcXVlc3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBvXG4gKiBAcGFyYW0ge21vZHVsZTp1dGlscy9yZWZlcnJlcn5yZWZlcnJlclVSTENhbGxiYWNrfSBvLnJlZmVycmVyVVJMQ2FsbGJhY2tcbiAqIEBwYXJhbSB7bW9kdWxlOnV0aWxzL3JlZmVycmVyfnJlZmVycmVyT3JpZ2luQ2FsbGJhY2t9IG8ucmVmZXJyZXJPcmlnaW5DYWxsYmFja1xuICogQHJldHVybnMge2V4dGVybmFsOlVSTH0gUmVxdWVzdCdzIHJlZmVycmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVSZXF1ZXN0c1JlZmVycmVyKHJlcXVlc3QsIHtyZWZlcnJlclVSTENhbGxiYWNrLCByZWZlcnJlck9yaWdpbkNhbGxiYWNrfSA9IHt9KSB7XG5cdC8vIFRoZXJlIGFyZSAyIG5vdGVzIGluIHRoZSBzcGVjaWZpY2F0aW9uIGFib3V0IGludmFsaWQgcHJlLWNvbmRpdGlvbnMuICBXZSByZXR1cm4gbnVsbCwgaGVyZSwgZm9yXG5cdC8vIHRoZXNlIGNhc2VzOlxuXHQvLyA+IE5vdGU6IElmIHJlcXVlc3QncyByZWZlcnJlciBpcyBcIm5vLXJlZmVycmVyXCIsIEZldGNoIHdpbGwgbm90IGNhbGwgaW50byB0aGlzIGFsZ29yaXRobS5cblx0Ly8gPiBOb3RlOiBJZiByZXF1ZXN0J3MgcmVmZXJyZXIgcG9saWN5IGlzIHRoZSBlbXB0eSBzdHJpbmcsIEZldGNoIHdpbGwgbm90IGNhbGwgaW50byB0aGlzXG5cdC8vID4gYWxnb3JpdGhtLlxuXHRpZiAocmVxdWVzdC5yZWZlcnJlciA9PT0gJ25vLXJlZmVycmVyJyB8fCByZXF1ZXN0LnJlZmVycmVyUG9saWN5ID09PSAnJykge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Ly8gMS4gTGV0IHBvbGljeSBiZSByZXF1ZXN0J3MgYXNzb2NpYXRlZCByZWZlcnJlciBwb2xpY3kuXG5cdGNvbnN0IHBvbGljeSA9IHJlcXVlc3QucmVmZXJyZXJQb2xpY3k7XG5cblx0Ly8gMi4gTGV0IGVudmlyb25tZW50IGJlIHJlcXVlc3QncyBjbGllbnQuXG5cdC8vIG5vdCBhcHBsaWNhYmxlIHRvIG5vZGUuanNcblxuXHQvLyAzLiBTd2l0Y2ggb24gcmVxdWVzdCdzIHJlZmVycmVyOlxuXHRpZiAocmVxdWVzdC5yZWZlcnJlciA9PT0gJ2Fib3V0OmNsaWVudCcpIHtcblx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0fVxuXG5cdC8vIFwiYSBVUkxcIjogTGV0IHJlZmVycmVyU291cmNlIGJlIHJlcXVlc3QncyByZWZlcnJlci5cblx0Y29uc3QgcmVmZXJyZXJTb3VyY2UgPSByZXF1ZXN0LnJlZmVycmVyO1xuXG5cdC8vIDQuIExldCByZXF1ZXN0J3MgcmVmZXJyZXJVUkwgYmUgdGhlIHJlc3VsdCBvZiBzdHJpcHBpbmcgcmVmZXJyZXJTb3VyY2UgZm9yIHVzZSBhcyBhIHJlZmVycmVyLlxuXHRsZXQgcmVmZXJyZXJVUkwgPSBzdHJpcFVSTEZvclVzZUFzQVJlZmVycmVyKHJlZmVycmVyU291cmNlKTtcblxuXHQvLyA1LiBMZXQgcmVmZXJyZXJPcmlnaW4gYmUgdGhlIHJlc3VsdCBvZiBzdHJpcHBpbmcgcmVmZXJyZXJTb3VyY2UgZm9yIHVzZSBhcyBhIHJlZmVycmVyLCB3aXRoIHRoZVxuXHQvLyAgICBvcmlnaW4tb25seSBmbGFnIHNldCB0byB0cnVlLlxuXHRsZXQgcmVmZXJyZXJPcmlnaW4gPSBzdHJpcFVSTEZvclVzZUFzQVJlZmVycmVyKHJlZmVycmVyU291cmNlLCB0cnVlKTtcblxuXHQvLyA2LiBJZiB0aGUgcmVzdWx0IG9mIHNlcmlhbGl6aW5nIHJlZmVycmVyVVJMIGlzIGEgc3RyaW5nIHdob3NlIGxlbmd0aCBpcyBncmVhdGVyIHRoYW4gNDA5Niwgc2V0XG5cdC8vICAgIHJlZmVycmVyVVJMIHRvIHJlZmVycmVyT3JpZ2luLlxuXHRpZiAocmVmZXJyZXJVUkwudG9TdHJpbmcoKS5sZW5ndGggPiA0MDk2KSB7XG5cdFx0cmVmZXJyZXJVUkwgPSByZWZlcnJlck9yaWdpbjtcblx0fVxuXG5cdC8vIDcuIFRoZSB1c2VyIGFnZW50IE1BWSBhbHRlciByZWZlcnJlclVSTCBvciByZWZlcnJlck9yaWdpbiBhdCB0aGlzIHBvaW50IHRvIGVuZm9yY2UgYXJiaXRyYXJ5XG5cdC8vICAgIHBvbGljeSBjb25zaWRlcmF0aW9ucyBpbiB0aGUgaW50ZXJlc3RzIG9mIG1pbmltaXppbmcgZGF0YSBsZWFrYWdlLiBGb3IgZXhhbXBsZSwgdGhlIHVzZXJcblx0Ly8gICAgYWdlbnQgY291bGQgc3RyaXAgdGhlIFVSTCBkb3duIHRvIGFuIG9yaWdpbiwgbW9kaWZ5IGl0cyBob3N0LCByZXBsYWNlIGl0IHdpdGggYW4gZW1wdHlcblx0Ly8gICAgc3RyaW5nLCBldGMuXG5cdGlmIChyZWZlcnJlclVSTENhbGxiYWNrKSB7XG5cdFx0cmVmZXJyZXJVUkwgPSByZWZlcnJlclVSTENhbGxiYWNrKHJlZmVycmVyVVJMKTtcblx0fVxuXG5cdGlmIChyZWZlcnJlck9yaWdpbkNhbGxiYWNrKSB7XG5cdFx0cmVmZXJyZXJPcmlnaW4gPSByZWZlcnJlck9yaWdpbkNhbGxiYWNrKHJlZmVycmVyT3JpZ2luKTtcblx0fVxuXG5cdC8vIDguRXhlY3V0ZSB0aGUgc3RhdGVtZW50cyBjb3JyZXNwb25kaW5nIHRvIHRoZSB2YWx1ZSBvZiBwb2xpY3k6XG5cdGNvbnN0IGN1cnJlbnRVUkwgPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcblxuXHRzd2l0Y2ggKHBvbGljeSkge1xuXHRcdGNhc2UgJ25vLXJlZmVycmVyJzpcblx0XHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXG5cdFx0Y2FzZSAnb3JpZ2luJzpcblx0XHRcdHJldHVybiByZWZlcnJlck9yaWdpbjtcblxuXHRcdGNhc2UgJ3Vuc2FmZS11cmwnOlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXG5cdFx0Y2FzZSAnc3RyaWN0LW9yaWdpbic6XG5cdFx0XHQvLyAxLiBJZiByZWZlcnJlclVSTCBpcyBhIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCBhbmQgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGlzIG5vdCBhXG5cdFx0XHQvLyAgICBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwsIHRoZW4gcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRcdFx0aWYgKGlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShyZWZlcnJlclVSTCkgJiYgIWlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShjdXJyZW50VVJMKSkge1xuXHRcdFx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0XHRcdH1cblxuXHRcdFx0Ly8gMi4gUmV0dXJuIHJlZmVycmVyT3JpZ2luLlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyT3JpZ2luLnRvU3RyaW5nKCk7XG5cblx0XHRjYXNlICdzdHJpY3Qtb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJzpcblx0XHRcdC8vIDEuIElmIHRoZSBvcmlnaW4gb2YgcmVmZXJyZXJVUkwgYW5kIHRoZSBvcmlnaW4gb2YgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGFyZSB0aGUgc2FtZSwgdGhlblxuXHRcdFx0Ly8gICAgcmV0dXJuIHJlZmVycmVyVVJMLlxuXHRcdFx0aWYgKHJlZmVycmVyVVJMLm9yaWdpbiA9PT0gY3VycmVudFVSTC5vcmlnaW4pIHtcblx0XHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyAyLiBJZiByZWZlcnJlclVSTCBpcyBhIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCBhbmQgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGlzIG5vdCBhXG5cdFx0XHQvLyAgICBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwsIHRoZW4gcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRcdFx0aWYgKGlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShyZWZlcnJlclVSTCkgJiYgIWlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShjdXJyZW50VVJMKSkge1xuXHRcdFx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0XHRcdH1cblxuXHRcdFx0Ly8gMy4gUmV0dXJuIHJlZmVycmVyT3JpZ2luLlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyT3JpZ2luO1xuXG5cdFx0Y2FzZSAnc2FtZS1vcmlnaW4nOlxuXHRcdFx0Ly8gMS4gSWYgdGhlIG9yaWdpbiBvZiByZWZlcnJlclVSTCBhbmQgdGhlIG9yaWdpbiBvZiByZXF1ZXN0J3MgY3VycmVudCBVUkwgYXJlIHRoZSBzYW1lLCB0aGVuXG5cdFx0XHQvLyAgICByZXR1cm4gcmVmZXJyZXJVUkwuXG5cdFx0XHRpZiAocmVmZXJyZXJVUkwub3JpZ2luID09PSBjdXJyZW50VVJMLm9yaWdpbikge1xuXHRcdFx0XHRyZXR1cm4gcmVmZXJyZXJVUkw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIDIuIFJldHVybiBubyByZWZlcnJlci5cblx0XHRcdHJldHVybiAnbm8tcmVmZXJyZXInO1xuXG5cdFx0Y2FzZSAnb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luJzpcblx0XHRcdC8vIDEuIElmIHRoZSBvcmlnaW4gb2YgcmVmZXJyZXJVUkwgYW5kIHRoZSBvcmlnaW4gb2YgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGFyZSB0aGUgc2FtZSwgdGhlblxuXHRcdFx0Ly8gICAgcmV0dXJuIHJlZmVycmVyVVJMLlxuXHRcdFx0aWYgKHJlZmVycmVyVVJMLm9yaWdpbiA9PT0gY3VycmVudFVSTC5vcmlnaW4pIHtcblx0XHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXR1cm4gcmVmZXJyZXJPcmlnaW4uXG5cdFx0XHRyZXR1cm4gcmVmZXJyZXJPcmlnaW47XG5cblx0XHRjYXNlICduby1yZWZlcnJlci13aGVuLWRvd25ncmFkZSc6XG5cdFx0XHQvLyAxLiBJZiByZWZlcnJlclVSTCBpcyBhIHBvdGVudGlhbGx5IHRydXN0d29ydGh5IFVSTCBhbmQgcmVxdWVzdCdzIGN1cnJlbnQgVVJMIGlzIG5vdCBhXG5cdFx0XHQvLyAgICBwb3RlbnRpYWxseSB0cnVzdHdvcnRoeSBVUkwsIHRoZW4gcmV0dXJuIG5vIHJlZmVycmVyLlxuXHRcdFx0aWYgKGlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShyZWZlcnJlclVSTCkgJiYgIWlzVXJsUG90ZW50aWFsbHlUcnVzdHdvcnRoeShjdXJyZW50VVJMKSkge1xuXHRcdFx0XHRyZXR1cm4gJ25vLXJlZmVycmVyJztcblx0XHRcdH1cblxuXHRcdFx0Ly8gMi4gUmV0dXJuIHJlZmVycmVyVVJMLlxuXHRcdFx0cmV0dXJuIHJlZmVycmVyVVJMO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgcmVmZXJyZXJQb2xpY3k6ICR7cG9saWN5fWApO1xuXHR9XG59XG5cbi8qKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL3dlYmFwcHNlYy1yZWZlcnJlci1wb2xpY3kvI3BhcnNlLXJlZmVycmVyLXBvbGljeS1mcm9tLWhlYWRlcnxSZWZlcnJlciBQb2xpY3kgXHUwMEE3OC4xLiBQYXJzZSBhIHJlZmVycmVyIHBvbGljeSBmcm9tIGEgUmVmZXJyZXItUG9saWN5IGhlYWRlcn1cbiAqIEBwYXJhbSB7SGVhZGVyc30gaGVhZGVycyBSZXNwb25zZSBoZWFkZXJzXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwb2xpY3lcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUmVmZXJyZXJQb2xpY3lGcm9tSGVhZGVyKGhlYWRlcnMpIHtcblx0Ly8gMS4gTGV0IHBvbGljeS10b2tlbnMgYmUgdGhlIHJlc3VsdCBvZiBleHRyYWN0aW5nIGhlYWRlciBsaXN0IHZhbHVlcyBnaXZlbiBgUmVmZXJyZXItUG9saWN5YFxuXHQvLyAgICBhbmQgcmVzcG9uc2VcdTIwMTlzIGhlYWRlciBsaXN0LlxuXHRjb25zdCBwb2xpY3lUb2tlbnMgPSAoaGVhZGVycy5nZXQoJ3JlZmVycmVyLXBvbGljeScpIHx8ICcnKS5zcGxpdCgvWyxcXHNdKy8pO1xuXG5cdC8vIDIuIExldCBwb2xpY3kgYmUgdGhlIGVtcHR5IHN0cmluZy5cblx0bGV0IHBvbGljeSA9ICcnO1xuXG5cdC8vIDMuIEZvciBlYWNoIHRva2VuIGluIHBvbGljeS10b2tlbnMsIGlmIHRva2VuIGlzIGEgcmVmZXJyZXIgcG9saWN5IGFuZCB0b2tlbiBpcyBub3QgdGhlIGVtcHR5XG5cdC8vICAgIHN0cmluZywgdGhlbiBzZXQgcG9saWN5IHRvIHRva2VuLlxuXHQvLyBOb3RlOiBUaGlzIGFsZ29yaXRobSBsb29wcyBvdmVyIG11bHRpcGxlIHBvbGljeSB2YWx1ZXMgdG8gYWxsb3cgZGVwbG95bWVudCBvZiBuZXcgcG9saWN5XG5cdC8vIHZhbHVlcyB3aXRoIGZhbGxiYWNrcyBmb3Igb2xkZXIgdXNlciBhZ2VudHMsIGFzIGRlc2NyaWJlZCBpbiBcdTAwQTcgMTEuMSBVbmtub3duIFBvbGljeSBWYWx1ZXMuXG5cdGZvciAoY29uc3QgdG9rZW4gb2YgcG9saWN5VG9rZW5zKSB7XG5cdFx0aWYgKHRva2VuICYmIFJlZmVycmVyUG9saWN5Lmhhcyh0b2tlbikpIHtcblx0XHRcdHBvbGljeSA9IHRva2VuO1xuXHRcdH1cblx0fVxuXG5cdC8vIDQuIFJldHVybiBwb2xpY3kuXG5cdHJldHVybiBwb2xpY3k7XG59XG4iLCAiaW1wb3J0IHtGZXRjaEJhc2VFcnJvcn0gZnJvbSAnLi9iYXNlLmpzJztcblxuLyoqXG4gKiBBYm9ydEVycm9yIGludGVyZmFjZSBmb3IgY2FuY2VsbGVkIHJlcXVlc3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBBYm9ydEVycm9yIGV4dGVuZHMgRmV0Y2hCYXNlRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtZXNzYWdlLCB0eXBlID0gJ2Fib3J0ZWQnKSB7XG5cdFx0c3VwZXIobWVzc2FnZSwgdHlwZSk7XG5cdH1cbn1cbiIsICJleHBvcnQgY2xhc3MgV2FybmluZyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJXYXJuaW5nXCI7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgRXJyb3JUZXh0ID0geyBuYW1lOiBzdHJpbmc7IG1lc3NhZ2U6IHN0cmluZyB9O1xuZXhwb3J0IGNvbnN0IEVycm9yVGV4dCA9IChuYW1lOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZykgPT4gKHsgbmFtZSwgbWVzc2FnZSB9KTtcblxuZXhwb3J0IGNsYXNzIFByZXNlbnRhYmxlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxufVxuIiwgImltcG9ydCB7IGJpdGJ1Y2tldEZldGNoT2JqZWN0IH0gZnJvbSBcIi4uL2hlbHBlcnMvYml0YnVja2V0XCI7XG5cbmludGVyZmFjZSBSZXBvc2l0b3JpZXNSZXNwb25zZSB7XG4gIHZhbHVlczogYW55W107XG4gIG5leHRQYWdlU3RhcnQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQHBhcmFtIGtleVxuICogQHBhcmFtIHN0YXJ0XG4gKiBAcGFyYW0gcmVwb3NpdG9yaWVzXG4gKiBAcmV0dXJuc1xuICogQHNlZSBodHRwczovL2RldmVsb3Blci5hdGxhc3NpYW4uY29tL3NlcnZlci9iaXRidWNrZXQvcmVzdC92ODA1L2FwaS1ncm91cC1yZXBvc2l0b3J5LyNhcGktYXBpLWxhdGVzdC1yZXBvcy1nZXRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFJlcG9zaXRvcmllcyhrZXk6IHN0cmluZywgc3RhcnQgPSAwLCByZXBvc2l0b3JpZXM6IGFueVtdID0gW10pOiBQcm9taXNlPGFueVtdPiB7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBiaXRidWNrZXRGZXRjaE9iamVjdDxSZXBvc2l0b3JpZXNSZXNwb25zZT4oXCIvcmVzdC9hcGkvbGF0ZXN0L3JlcG9zXCIsIHtcbiAgICBzdGFydCxcbiAgICBsaW1pdDogMjAwLFxuICB9KTtcblxuICByZXBvc2l0b3JpZXMgPSByZXBvc2l0b3JpZXMuY29uY2F0KGRhdGEudmFsdWVzKTtcbiAgaWYgKGRhdGEubmV4dFBhZ2VTdGFydCkge1xuICAgIHJldHVybiBnZXRSZXBvc2l0b3JpZXMoa2V5LCBkYXRhLm5leHRQYWdlU3RhcnQsIHJlcG9zaXRvcmllcyk7XG4gIH1cblxuICByZXR1cm4gcmVwb3NpdG9yaWVzO1xufVxuXG5pbnRlcmZhY2UgUHVsbFJlcXVlc3RzUmVzcG9uc2Uge1xuICB2YWx1ZXM6IGFueVtdO1xuICBuZXh0UGFnZVN0YXJ0PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEBwYXJhbSByZXBvc2l0b3J5XG4gKiBAcGFyYW0gc3RhcnRcbiAqIEBwYXJhbSBwdWxsUmVxdWVzdHNcbiAqIEByZXR1cm5zXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmF0bGFzc2lhbi5jb20vc2VydmVyL2JpdGJ1Y2tldC9yZXN0L3Y4MDUvYXBpLWdyb3VwLXB1bGwtcmVxdWVzdHMvI2FwaS1hcGktbGF0ZXN0LXByb2plY3RzLXByb2plY3RrZXktcmVwb3MtcmVwb3NpdG9yeXNsdWctcHVsbC1yZXF1ZXN0cy1nZXRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1bGxSZXF1ZXN0c0dldFF1ZXJ5KFxuICByZXBvc2l0b3J5OiB7IHByb2plY3Q6IHsga2V5OiBzdHJpbmcgfTsgc2x1Zzogc3RyaW5nIH0sXG4gIHN0YXJ0ID0gMCxcbiAgcHVsbFJlcXVlc3RzOiBhbnlbXSA9IFtdXG4pOiBQcm9taXNlPGFueVtdPiB7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBiaXRidWNrZXRGZXRjaE9iamVjdDxQdWxsUmVxdWVzdHNSZXNwb25zZT4oXG4gICAgYC9yZXN0L2FwaS9sYXRlc3QvcHJvamVjdHMvJHtyZXBvc2l0b3J5LnByb2plY3Qua2V5fS9yZXBvcy8ke3JlcG9zaXRvcnkuc2x1Z30vcHVsbC1yZXF1ZXN0c2AsXG4gICAge1xuICAgICAgYXZhdGFyU2l6ZTogNjQsXG4gICAgICBvcmRlcjogXCJuZXdlc3RcIixcbiAgICAgIHN0YXRlOiBcIk9QRU5cIixcbiAgICAgIHN0YXJ0LFxuICAgIH1cbiAgKTtcblxuICBwdWxsUmVxdWVzdHMgPSBwdWxsUmVxdWVzdHMuY29uY2F0KGRhdGEudmFsdWVzKTtcbiAgaWYgKGRhdGEubmV4dFBhZ2VTdGFydCkge1xuICAgIHJldHVybiBwdWxsUmVxdWVzdHNHZXRRdWVyeShyZXBvc2l0b3J5LCBkYXRhLm5leHRQYWdlU3RhcnQsIHB1bGxSZXF1ZXN0cyk7XG4gIH1cblxuICByZXR1cm4gcHVsbFJlcXVlc3RzO1xufVxuXG4vKipcbiAqIEBwYXJhbSBzdGFydFxuICogQHBhcmFtIHB1bGxSZXF1ZXN0c1xuICogQHJldHVybnNcbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuYXRsYXNzaWFuLmNvbS9zZXJ2ZXIvYml0YnVja2V0L3Jlc3QvdjgwNS9hcGktZ3JvdXAtZGFzaGJvYXJkLyNhcGktYXBpLWxhdGVzdC1kYXNoYm9hcmQtcHVsbC1yZXF1ZXN0cy1nZXRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE15T3BlblB1bGxSZXF1ZXN0cyhzdGFydCA9IDAsIHB1bGxSZXF1ZXN0czogYW55W10gPSBbXSk6IFByb21pc2U8YW55W10+IHtcbiAgY29uc3QgZGF0YSA9IGF3YWl0IGJpdGJ1Y2tldEZldGNoT2JqZWN0PFB1bGxSZXF1ZXN0c1Jlc3BvbnNlPihcIi9yZXN0L2FwaS9sYXRlc3QvZGFzaGJvYXJkL3B1bGwtcmVxdWVzdHNcIiwge1xuICAgIHN0YXRlOiBcIk9QRU5cIixcbiAgICBzdGFydCxcbiAgfSk7XG5cbiAgcHVsbFJlcXVlc3RzID0gcHVsbFJlcXVlc3RzLmNvbmNhdChkYXRhLnZhbHVlcyk7XG4gIGlmIChkYXRhLm5leHRQYWdlU3RhcnQpIHtcbiAgICByZXR1cm4gZ2V0TXlPcGVuUHVsbFJlcXVlc3RzKGRhdGEubmV4dFBhZ2VTdGFydCwgcHVsbFJlcXVlc3RzKTtcbiAgfVxuXG4gIHJldHVybiBwdWxsUmVxdWVzdHM7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFBZ0JBLFFBQUk7QUFDbEIsZUFBTztNQUNUO0FDQ00sZUFBVSxhQUFhQyxJQUFNO0FBQ2pDLGVBQVEsT0FBT0EsT0FBTSxZQUFZQSxPQUFNLFFBQVMsT0FBT0EsT0FBTTtNQUMvRDtBQUVPLFlBQU0saUNBVVBEO0FBRVUsZUFBQSxnQkFBZ0IsSUFBYyxNQUFZO0FBQ3hELFlBQUk7QUFDRixpQkFBTyxlQUFlLElBQUksUUFBUTtZQUNoQyxPQUFPO1lBQ1AsY0FBYztVQUNmLENBQUE7aUJBQ0RFLEtBQU07O01BSVY7QUMxQkEsWUFBTSxrQkFBa0I7QUFDeEIsWUFBTSxzQkFBc0IsUUFBUSxVQUFVO0FBQzlDLFlBQU0sd0JBQXdCLFFBQVEsT0FBTyxLQUFLLGVBQWU7QUFHM0QsZUFBVSxXQUFjLFVBR3JCO0FBQ1AsZUFBTyxJQUFJLGdCQUFnQixRQUFRO01BQ3JDO0FBR00sZUFBVSxvQkFBdUIsT0FBeUI7QUFDOUQsZUFBTyxXQUFXLGFBQVcsUUFBUSxLQUFLLENBQUM7TUFDN0M7QUFHTSxlQUFVLG9CQUErQixRQUFXO0FBQ3hELGVBQU8sc0JBQXNCLE1BQU07TUFDckM7ZUFFZ0IsbUJBQ2QsU0FDQSxhQUNBLFlBQThEO0FBRzlELGVBQU8sb0JBQW9CLEtBQUssU0FBUyxhQUFhLFVBQVU7TUFDbEU7ZUFLZ0IsWUFDZCxTQUNBLGFBQ0EsWUFBc0Q7QUFDdEQsMkJBQ0UsbUJBQW1CLFNBQVMsYUFBYSxVQUFVLEdBQ25ELFFBQ0EsOEJBQThCO01BRWxDO0FBRWdCLGVBQUEsZ0JBQW1CLFNBQXFCLGFBQW1EO0FBQ3pHLG9CQUFZLFNBQVMsV0FBVztNQUNsQztBQUVn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QUFzQixFQUFFLENBQUM7QUFBQSxNQUN4RjtBQUFBLElBQ0Y7QUFFQSxhQUFTO0FBQUEsRUFDWCxHQUFHLENBQUMsQ0FBQztBQUVMLE1BQUksTUFBTSxPQUFPO0FBQ2YsK0JBQVUsa0JBQU0sTUFBTSxTQUFTLCtCQUErQixNQUFNLE1BQU0sT0FBTztBQUFBLEVBQ25GO0FBRUEsU0FDRSw0Q0FBQyxvQkFBSyxXQUFXLENBQUMsTUFBTSxnQkFBZ0IsQ0FBQyxNQUFNLE9BQU8sc0JBQXFCLHFCQUN6RSxzREFBQyxpQkFBSyxTQUFMLEVBQWEsT0FBTSxzQkFBcUIsVUFBVSxNQUFNLGNBQWMsU0FBUyxJQUM3RSxnQkFBTSxjQUFjLElBQUksQ0FBQyxPQUN4QjtBQUFBLElBQUMsaUJBQUs7QUFBQSxJQUFMO0FBQUEsTUFFQyxPQUFPLEdBQUc7QUFBQSxNQUNWLFVBQVUsR0FBRztBQUFBLE1BQ2IsYUFBYTtBQUFBLFFBQ1gsRUFBRSxNQUFNLEdBQUcsR0FBRyxZQUFZLGdDQUFzQixHQUFHLE9BQU8sUUFBUSxHQUFHO0FBQUEsUUFDckUsRUFBRSxNQUFNLEVBQUUsUUFBUSxHQUFHLE9BQU8sS0FBSyxNQUFNLGtCQUFNLEtBQUssT0FBTyxFQUFFO0FBQUEsTUFDN0Q7QUFBQSxNQUNBLE1BQU0sRUFBRSxRQUFRLGVBQWUsV0FBVyxrQkFBTSxZQUFZO0FBQUEsTUFDNUQsU0FDRSw0Q0FBQywyQkFDQyxzREFBQyx3QkFBWSxTQUFaLEVBQ0Msc0RBQUMsbUJBQU8sZUFBUCxFQUFxQixPQUFNLGdDQUErQixLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksR0FDL0UsR0FDRjtBQUFBO0FBQUEsSUFiRyxHQUFHO0FBQUEsRUFlVixDQUNELEdBQ0gsR0FDRjtBQUVKOyIsCiAgIm5hbWVzIjogWyJub29wIiwgIngiLCAiX2EiLCAiRiIsICJpIiwgImUiLCAicXVldWVNaWNyb3Rhc2siLCAiciIsICJpbml0IiwgImlzQWJvcnRTaWduYWwiLCAic3RyZWFtQnJhbmRDaGVja0V4Y2VwdGlvbiIsICJkZWZhdWx0Q29udHJvbGxlckJyYW5kQ2hlY2tFeGNlcHRpb24iLCAiRE9NRXhjZXB0aW9uIiwgIlJlYWRhYmxlU3RyZWFtIiwgIlBPT0xfU0laRSIsICJwcm9jZXNzIiwgIkJsb2IiLCAiY2xvbmUiLCAiQmxvYiIsICJzaXplIiwgIkZpbGUiLCAiRiIsICJmIiwgImUiLCAiRm9ybURhdGEiLCAibSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJmcyIsICJtIiwgIkJvZHkiLCAiZiIsICJpIiwgImNsZWFyIiwgImltcG9ydF9hcGkiLCAiaW1wb3J0X25vZGVfaHR0cCIsICJpbXBvcnRfbm9kZV9zdHJlYW0iLCAiaW1wb3J0X25vZGVfYnVmZmVyIiwgImkiLCAiU3RyZWFtIiwgInRvRm9ybURhdGEiLCAiaW1wb3J0X25vZGVfdXRpbCIsICJodHRwIiwgImluaXQiLCAiaGVhZGVycyIsICJJTlRFUk5BTFMiLCAiaGVhZGVycyIsICJpbml0IiwgImltcG9ydF9ub2RlX3V0aWwiLCAiaGVhZGVycyIsICJJTlRFUk5BTFMiLCAiaW5pdCIsICJoZWFkZXJzIiwgImZvcm1hdFVybCIsICJhZ2VudCIsICJyZXNwb25zZSIsICJodHRwcyIsICJodHRwIiwgIlN0cmVhbSIsICJzIiwgImhlYWRlcnMiLCAicHVtcCIsICJ6bGliIiwgImh0dHBzIl0KfQo=

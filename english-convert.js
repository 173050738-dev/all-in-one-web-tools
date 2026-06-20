const fs = require("fs");
const path = require("path");

const SRC = "D:/projects/PDF工具/src";

const replacements = new Map();

// 1. layout.tsx
replacements.set("app/layout.tsx", [
  ['lang="zh-CN"', 'lang="en"'],
]);
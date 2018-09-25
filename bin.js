#!/usr/bin/env node

const {existsSync, readFileSync, writeFileSync} = require(`fs`);
const {relative, resolve} = require(`path`);

const pnpSource = process.argv[2] || `pnpapi`;
const prodOnly = true;

let pnp;

try {
  pnp = require(pnpSource);
} catch (error) {
  if (pnpSource === `pnpapi`) {
    console.error(`Couldn't load the PnP api from your environment - is Plug'n'Play enabled?`);
    console.error(`Check the instruction at https://github.com/arcanis/build-pnm for more information.`);
  } else {
    console.error(`Couldn't load the specified file (${pnpSource}).`);
  }
  throw error;
}

const packageNameMaps = {path_prefix: `/`, packages: {}, scopes: {}};
const packageRefCount = new Map();

function getPackageJson(path) {
  // Some packages have install errors that cause them to be removed from the disk
  try {
    return require(path);
  } catch (error) {
    return {};
  }
}

function filterDevDependencies(packageInformation, dependencies) {
  const pkgJson = getPackageJson(resolve(packageInformation.packageLocation, `package.json`));

  if (!pkgJson.devDependencies)
    return dependencies;

  const copy = new Map(dependencies);

  for (const [name, reference] of Object.entries(pkgJson.devDependencies))
    copy.delete(name);

  return copy;
}

function traverseDependencyTree(pnp, cb) {
  const traversed = new Set();

  function traversePackage(locator) {
    const packageInformation = pnp.getPackageInformation(locator);

    // Skip packages that haven't been installed
    if (!packageInformation.packageLocation)
      return;

    // Skip packages that have already been traversed
    if (traversed.has(packageInformation))
      return;

    // Don't recurse on the top-level devDependencies?
    const dependencies = locator.name === null && prodOnly
      ? filterDevDependencies(packageInformation, packageInformation.packageDependencies)
      : packageInformation.packageDependencies;

    traversed.add(packageInformation);
    cb(locator, packageInformation, dependencies);

    for (const [name, reference] of dependencies.entries()) {
      traversePackage({name, reference});
    }
  }

  traversePackage(pnp.topLevel);
}

function addPackages(pnp, packages, parentInformation, packageDependencies) {
  for (const [name, reference] of packageDependencies.entries()) {
    const dependencyInformation = pnp.getPackageInformation({name, reference});
    const dependencyLocation = dependencyInformation.packageLocation;

    if (!dependencyLocation)
      continue;

    const path = relative(parentInformation.packageLocation, dependencyLocation) || `./`;
    const pkgJson = getPackageJson(resolve(dependencyLocation, `package.json`));
    const main = pkgJson.browser || pkgJson.main;

    packages[name] = {path, main};
  }
}

const topLevelInformation = pnp.getPackageInformation(pnp.topLevel);

traverseDependencyTree(pnp, (locator, packageInformation, packageDependencies) => {
  if (locator.name === null)
    return addPackages(pnp, packageNameMaps.packages, topLevelInformation, packageDependencies);

  const scope = relative(topLevelInformation.packageLocation, packageInformation.packageLocation);
  packageNameMaps.scopes[scope] = {packages:{}};

  addPackages(pnp, packageNameMaps.scopes[scope].packages, packageInformation, packageDependencies);
});

const target = `package-name-maps.json`;
const newSource = JSON.stringify(packageNameMaps, null, 2);

let isOutdated = existsSync(target)
  ? readFileSync(target, `utf8`) !== newSource
  : true;

if (isOutdated) {
  writeFileSync(target, newSource);
}

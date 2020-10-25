class SeedsMaker {
  constructor(hash, times = 10) {
    this.hash = hash;
    this.times = times;
  }

  make = () => {
    let seeds = [];
    let destroyOrder = [];
    for (const table in this.hash) {
      let seed = `${this.times}.times do |i|\n`;
      const tableName = this.getTableName(table);
      destroyOrder.push(`${tableName}.destroy_all\n`);
      seed += `  ${tableName}.create(\n`;
      for (const column in this.hash[table]) {
        const columnName = column;
        if (columnName !== "index") {
          let columnType = this.hash[table][column];
          columnType = this.getValueByType(columnType, columnName, tableName);
          seed += `    ${columnName}: ${columnType},\n`;
        }
      }
      seed += "  )\n";
      seed += "end\n\n";
      seeds.push(seed);
    }
    destroyOrder.push("\n");
    seeds.push(destroyOrder);
    return seeds.reverse().flat().join("");
  };

  getTableName = (table) => {
    let name;
    if (table.slice(table.length - 3) === "ies") {
      name = table.slice(0, table.length - 3) + "y";
    } else {
      name = table.slice(0, table.length - 1);
    }

    return this.pascalCaseName(name);
  };

  pascalCaseName = (name) => {
    return name
      .split("_")
      .map((w) => w[0].toUpperCase() + w.substring(1))
      .join("");
  };

  getValueByType = (type, name, table) => {
    switch (type) {
      case "string":
        return this.stringType(name, table);
      case "text":
        return "'Lorem ipsum ...'";
      case "bigint":
        return this.bigintType(name);
      case "float":
      case "decimal":
      case "integer":
        return "rand(10...250)";
      case "date":
        return "Date.now";
      case "time":
      case "datetime":
        return "Time.now";
      default:
        return type;
    }
  };

  stringType = (name, table) => {
    if (name === "email") {
      return `\'${table.toLowerCase()}-mail' + i + '@yopmail.com\'`;
    }

    return "''";
  };

  bigintType = (name) => {
    if (name.slice(name.length - 2) === "id") {
      const withoutId = name.slice(0, name.length - 3);
      return `${this.pascalCaseName(withoutId)}.all.sample.id`;
    }

    return "'#{i}'";
  };
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, "src", "controllers"),
  path.join(__dirname, "src", "middlewares"),
  path.join(__dirname, "src", "models"),
  path.join(__dirname, "src", "utils"),
  path.join(__dirname, "src", "seeders"),
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // Fix Error.statusCode by casting to any: (error as any).statusCode
  content = content.replace(/error\.statusCode\s*=\s*/g, "(error as any).statusCode = ");

  // Fix mongoose.Schema without new
  content = content.replace(/=\s*mongoose\.Schema\(/g, "= new mongoose.Schema(");

  // Fix implicit any in orderController / userController
  content = content.replace(/\(sum, item\)/g, "(sum: number, item: any)");
  content = content.replace(/\(i\)/g, "(i: any)");
  content = content.replace(/\(addr\)/g, "(addr: any)");

  // Fix authMiddleware decoded type
  content = content.replace(/const decoded = jwt\.verify\(/g, "const decoded: any = jwt.verify(");
  content = content.replace(/error\.message\s*=\s*/g, "(error as any).message = ");
  content = content.replace(/error\.name/g, "(error as any).name");
  content = content.replace(/\(\.\.\.allowedRoles\)/g, "(...allowedRoles: string[])");

  // Fix couponController
  content = content.replace(/message, statusCode/g, "message: string, statusCode: number");
  
  // Fix restaurantController $or and other query object properties
  // It was building a query object: const query = { isOpen: true }; query.$or = ...
  // Fix it by explicitly typing query: const query: any = { isOpen: true };
  content = content.replace(/const query = {/g, "const query: any = {");
  
  // Fix restaurantController sortOptions
  // const sortOptions = {}; sortOptions.rating = -1;
  content = content.replace(/const sortOptions = {};/g, "const sortOptions: any = {};");
  
  // Fix userController updates object
  content = content.replace(/const updates = {/g, "const updates: any = {");

  // Fix authToken params
  content = content.replace(/export const sendToken = \(user, res\)/g, "export const sendToken = (user: any, res: any)");

  // Fix seeder null object check
  content = content.replace(/adminUser\._id/g, "adminUser!._id");

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Fixed ${filePath}`);
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".ts")) {
      processFile(fullPath);
    }
  }
}

for (const dir of dirs) {
  processDirectory(dir);
}

console.log("Fix script complete.");

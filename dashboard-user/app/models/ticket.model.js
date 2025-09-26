// const mongoose = require("mongoose");
// const slugify = require("slugify");
// const uniqueValidator = require("mongoose-unique-validator");

// const TicketSchema = mongoose.Schema({
//   slug: {
//     type: String,
//     lowercase: true,
//     unique: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   concert: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   position: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
// });

// TicketSchema.plugin(uniqueValidator, { msg: "alredy taken" });

// TicketSchema.pre("validate", async function (next) {
//   if (!this.slug) {
//     this.slug = slugify(this.position) + "-" + ((Math.random() * Math.pow(36, 10)) | 0).toString(36);
//   }
//   next();
// });

// TicketSchema.methods.toTicketResponse = async function () {
//   return {
//     slug: this.slug,
//     category: this.category,
//     concert: this.concert,
//     price: this.price,
//     position: this.position,
//     description: this.description,
//   };
// };

// TicketSchema.methods.toTicketCarouselResponse = function () {
//   return {
//     images: this.images,
//   };
// };

// module.exports = mongoose.model("Ticket", TicketSchema);

const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type:'string',
  base: joi.string(),
  messages: {
      'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
      escapeHTML: {
          validate(value, helpers) {
              const clean = sanitizeHtml(value, {
                  allowedTags: [],
                  allowedAttributes: {},
              });
              if (clean !== value) return helpers.error('string.escapeHTML', {value})
              return clean;
          }
      }
  }

});

const Joi = BaseJoi.extend(extension);

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    assignedDevs: Joi.array().single(),
  })
});

module.exports.ticketSchema = Joi.object({
  ticket: Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    priority: Joi.string().required(),
    type: Joi.string().required(),
    status: Joi.string()
  })
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    text: Joi.string().required().escapeHTML()
  })
})




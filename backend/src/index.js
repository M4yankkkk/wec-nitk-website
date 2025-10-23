'use strict';

// Helper function to capitalize the first letter (e.g., 'blog' -> 'Blog')
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // Check if the strapi-plugin-io is enabled
    if (strapi.io) {
      // We are listening for all 'afterPublish' events
      strapi.db.lifecycles.subscribe({
        models: ['api::blog.blog', 'api::event.event', 'api::hackathon.hackathon'], // Add any other models here
        
        async afterPublish(event) {
          // event.model.singularName will be 'blog', 'event', etc.
          // event.result is the entry that was just published
          
          const { singularName } = event.model;
          const { result } = event;

          // Find the title, using 'name' as a fallback
          const title = result.title || result.name || 'New Content';

          // Prepare the data to be sent
          const data = {
            type: capitalize(singularName), // 'Blog', 'Event', etc.
            title: title,
          };

          // Emit a 'new-content' event to all connected clients
          console.log('Emitting new-content:', data);
          strapi.io.emit('new-content', data);
        },
      });
    }
  },
};
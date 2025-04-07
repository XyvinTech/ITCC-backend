/**
 * @swagger
 * tags:
 *   - name: Event
 *     description: Event related endpoints
 */

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Create a new event
 *     description: This endpoint allows the creation of a new event. It validates the input data and checks for the existence of the event by its name.
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 description: The name of the event
 *                 example: "Sample Event"
 *               description:
 *                 type: string
 *                 description: The description of the event
 *                 example: "This is a sample event..."
 *               type:
 *                 type: string
 *                 description: The type of the event
 *                 example: "Online"
 *               image:
 *                 type: string
 *                 description: The URL of the event image
 *                 example: "https://example.com/event-image.jpg"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the event
 *                 example: "2024-08-29"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the event
 *                 example: "2024-08-30"
 *               platform:
 *                 type: string
 *                 description: The platform where the event will be held
 *                 example: "Zoom"
 *               link:
 *                 type: string
 *                 description: The event link URL
 *                 example: "https://example.com/event"
 *               venue:
 *                 type: string
 *                 description: The venue of the event
 *                 example: "Main Auditorium"
 *               organiserName:
 *                 type: string
 *                 description: The organiserName of the event
 *                 example: "Shibu"
 *               speakers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the speaker
 *                       example: "Joy"
 *                     designation:
 *                       type: string
 *                       description: The designation of the speaker
 *                       example: "Professor"
 *                     role:
 *                       type: string
 *                       description: The role of the speaker in the event
 *                       example: "Keynote Speaker"
 *                     image:
 *                       type: string
 *                       description: The URL of the speaker's image
 *                       example: "https://example.com/speaker-image.jpg"
 *             required:
 *               - eventName
 *               - type
 *               - startDate
 *               - endDate
 *               - speakers
 *     responses:
 *       201:
 *         description: New event created successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Event with this name already exists
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/single/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Retrieve an event using its unique ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/single/{id}:
 *   put:
 *     summary: Edit an Existing Event By ID
 *     description: Update an existing event by ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 description: The name of the event
 *                 example: "Sample Event"
 *               description:
 *                 type: string
 *                 description: The description of the event
 *                 example: "This is a sample event..."
 *               type:
 *                 type: string
 *                 description: The type of the event
 *                 example: "Workshop"
 *               image:
 *                 type: string
 *                 description: The URL of the event image
 *                 example: "https://example.com/event-image.jpg"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the event
 *                 example: "2024-08-29"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the event
 *                 example: "2024-08-30"
 *               platform:
 *                 type: string
 *                 description: The platform where the event will be held
 *                 example: "Zoom"
 *               link:
 *                 type: string
 *                 description: The event link URL
 *                 example: "https://example.com/event"
 *               venue:
 *                 type: string
 *                 description: The venue of the event
 *                 example: "Main Auditorium"
 *               organiserName:
 *                 type: string
 *                 description: The organiserName of the event
 *                 example: "Shibu"
 *               speakers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the speaker
 *                       example: "John"
 *                     designation:
 *                       type: string
 *                       description: The designation of the speaker
 *                       example: "Professor"
 *                     role:
 *                       type: string
 *                       description: The role of the speaker in the event
 *                       example: "Keynote Speaker"
 *                     image:
 *                       type: string
 *                       description: The URL of the speaker's image
 *                       example: "https://example.com/speaker-image.jpg"
 *                 description: List of speakers for the event
 *                 example:
 *                   - name: "John"
 *                     designation: "Professor"
 *                     role: "Keynote Speaker"
 *                     image: "https://example.com/speaker-image.jpg"
 *                   - name: "Alex"
 *                     designation: "Lecturer"
 *                     role: "Guest Speaker"
 *                     image: "https://example.com/speaker2-image.jpg"
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/single/{id}:
 *   delete:
 *     summary: Delete an Event By Id
 *     description: Delete an existing event by its ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/list:
 *   get:
 *     summary: Get all events
 *     description: Retrieve all events from the database.
 *     tags:
 *       - Event
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       404:
 *         description: No events found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/admin/list:
 *   get:
 *     summary: Get all events
 *     description: Retrieve all events from the database.
 *     tags:
 *       - Event
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       404:
 *         description: No events found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/single/{id}:
 *   patch:
 *     summary: Add an RSVP to an event
 *     description: Adds the current user's ID to the RSVP list of a specified event.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to which the RSVP is being added
 *     responses:
 *       200:
 *         description: RSVP added successfully
 *       400:
 *         description: Bad Request - Event ID is required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /event/reg-events:
 *   get:
 *     summary: Get events the user has registered for
 *     description: Retrieve a list of events for which the authenticated user has RSVP'd.
 *     tags:
 *       - Event
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *       404:
 *         description: No events found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /event/attend/{eventId}:
 *   post:
 *     summary: Mark attendance for an event
 *     description: Allows marking attendance for a user in a specific event. If the user has already been marked as attended, an error is returned.
 *     tags:
 *       - Event
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The details of the user marking attendance
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user attending the event
 *                 example: "12345"
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: Attendance marked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Attendance marked successfully."
 *                 attended:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: List of user IDs who have attended the event
 *       400:
 *         description: Event ID or user ID missing, or user already marked as attended
 *       404:
 *         description: Event or user not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /event/attend/{eventId}:
 *   get:
 *     summary: Get users who attended an event
 *     description: Retrieve a list of registered and attended users for a specific event.
 *     tags:
 *       - Event
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registered and attended users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registered and Attended users retrieved successfully."
 *                 registeredUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Name of the registered user
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: Email of the registered user
 *                         example: "john.doe@example.com"
 *                 attendedUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Name of the attended user
 *                         example: "Jane Smith"
 *                       email:
 *                         type: string
 *                         description: Email of the attended user
 *                         example: "jane.smith@example.com"
 *       400:
 *         description: Event ID is missing
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

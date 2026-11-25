--Readme document for *Miguel Diaz*, *mdiazqui*, *10182510*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?

about 20 hours

3. What online resources did you consult when completing this assignment? (list specific URLs)

I used claude to help me set up the environment, and explain errors throughout the assignment. 

Ionic Angular overview: https://ionicframework.com/docs/angular/overview
All Ionic components: https://ionicframework.com/docs/components
Segment: https://ionicframework.com/docs/api/segment
Datetime and datetime button: https://ionicframework.com/docs/api/datetime and https://ionicframework.com/docs/api/datetime-button
Modal: https://ionicframework.com/docs/api/modal
Range (the slider): https://ionicframework.com/docs/api/range
List and item: https://ionicframework.com/docs/api/list and https://ionicframework.com/docs/api/item
Toast: https://ionicframework.com/docs/api/toast
Stanford Sleepiness Scale: https://web.stanford.edu/~dement/sss.html
toLocaleTimeString on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
Setup links, for completeness: Ionic CLI https://ionicframework.com/docs/cli, Node https://nodejs.org, and Chrome device mode https://developer.chrome.com/docs/devtools/device-mode
Angular control flow (@if and @for): https://angular.dev/guide/templates/control-flow
Angular forms and ngModel: https://angular.dev/guide/forms


Storage
Capacitor Preferences: https://capacitorjs.com/docs/apis/preferences
Browser local storage (what Preferences uses on the web): https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
JSON.stringify and JSON.parse: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
Async functions: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Asynchronous

Theme
Ionic theming basics: https://ionicframework.com/docs/theming/basics
Colors: https://ionicframework.com/docs/theming/colors
Dark mode: https://ionicframework.com/docs/theming/dark-mode
Color generator (to make your own palette): https://ionicframework.com/docs/theming/color-creator
Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
Material Design 3: https://m3.material.io/
4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

None

5. Is there anything special we need to know in order to run your code?

There is nothing special about running the code. 

Open a terminal in the sleeptracker folder, run "npm install" then "ionic serve".

The app runs at localhost:8100 and starts empty, so please log a night and 
a sleepiness entry to see the app work. Please allow notifications when the browser 
asks, so the reminder feature can be seen. The data is saved in the browser's local storage, 
so clearing the site's data resets the app.

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

I designed it for college students, who often have irregular sleep schedules and want 
a quick way to log from their phone. The app keeps logging to a few taps, since students are busy.


7. Did you design your app specifically for iOS or Android, or both?

I designed it for both, with iOS conventions first, such as features like a bottom tab bar and swipe to delete. 
Ionic automatically restyles the components to match whichever platform the app runs on.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

In the Log tab, a person picks a bed time and a wake time with Ionic's date and time pickers, which start at "8 hours ago" 
and "now". Most people log in the morning, so the wake time is about right and they usually only adjust the bed time.


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

In the Log tab, a person drags a 1 to 7 slider that shows the matching Stanford Sleepiness Scale description as it moves, 
and the time defaults to now. This way people do not need to memorize the scale, and logging takes a few seconds, which 
matters for something done several times a day.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

The Today tab shows last night's sleep and the latest sleepiness at a glance, and the History tab lists every log, 
newest first, with overnight sleep and sleepiness in separate lists. Showing the most recent data first gives a useful 
first screen, and the full history should be there aswell.


11. Which feature choose--using a native device resource, backing up logged data, or both?

I used both

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

I added a daily reminder notification, using Capacitor Local Notifications, that asks the person to log their sleepiness at a time 
they choose. This follows the experience sampling method from the assignment, so the app prompts people to log instead of relying 
on them to remember.


13. If you backed up logged data, where does it back up to?
The logs and the reminder settings are saved with Capacitor Preferences, which uses the phone's device preferences, 
and the browser's local storage when running in a browser. When the app reopens, all the logs load back in.


14. How does your app implement or follow principles of good mobile design?

The first screen (Today) shows useful information and the two main actions, 
the Save button is disabled with a plain explanation when the times do not make sense (error prevention),
 and deleting a log asks for confirmation (the "uh-oh" safety net). 
 It follows platform conventions with a bottom tab bar, swipe to delete, native style pickers, 
 system fonts, and automatic dark mode since it is a sleeping app.

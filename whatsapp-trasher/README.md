# WhatsApp Trasher - Message Management Script for WhatsApp Web

**Overview:**  
This script provides a customized solution for managing the visibility of messages from specific users in WhatsApp Web groups. It is installed via extensions such as Greasemonkey, Tampermonkey, or Violentmonkey. The script allows for the hiding or alteration of the display of messages from selected users, giving you complete control over your group chat experience.

**Motivation:**

WhatsApp currently does not have a feature to hide messages from users in shared groups, not even by blocking them. This leaves few options: endure these messages or leave the group. However, this script for WhatsApp Web users (web.whatsapp.com) addresses this issue, allowing you to ignore these messages directly in your browser. Take control of your WhatsApp experience and choose what content you want to see.

**Example:**
![Selection_005](https://user-images.githubusercontent.com/47392003/283968758-17d10d32-d496-4ccf-86a9-65703a263c47.png)

**Installation and Setup:**

1. Install a compatible extension like Greasemonkey, Tampermonkey, or Violentmonkey in your browser.
2. Add the provided script to the chosen extension.
3. Access WhatsApp Web (web.whatsapp.com) and join a group.

**Usage:**

1. **Blocking Users:**

    - Place the cursor over the name of the message author in the group.
    - Press `Ctrl+Shift+X` to activate the blocking function.
    - A confirmation message will appear to add or remove the user from the blocked list.

2. **Hiding Styles:**
    - The script uses a variable to define the hiding style:
        - `banned`: Blurs the messages, making them unreadable.
        - `banned-icon`: Replaces messages with an icon (by default, a poop emoji).
        - `banned-hidden`: Completely hides the messages.
    - Clicking on the message or icon reveals the original content.
    - The `banned-hidden` option does not allow viewing the original message and could create confusion by hiding the existence of a message being responded to.

**Important Considerations:**

-   The behavior is local to the browser and does not modify the original data, group membership, or notify other users of the block.
-   The lack of response to messages from blocked users may be noticeable.
-   Disabling the script and refreshing the page will return WhatsApp to its usual functionality.

**Recommendations:**

-   Use the script discreetly to enhance your group experience without altering the general group dynamics.
-   Consider the `banned` or `banned-icon` option to maintain some level of context in group conversations.

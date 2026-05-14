export const registerEmailTemplate = (name: string) => `
  <div
    style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f5;
      padding: 40px 20px;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 40px 30px;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      "
    >

      <div style="text-align: center; margin-bottom: 30px;">
        <h1
          style="
            color: #2563eb;
            margin: 0;
            font-size: 28px;
          "
        >
          Welcome to LMS Platform 🚀
        </h1>

        <p
          style="
            color: #6b7280;
            font-size: 14px;
            margin-top: 8px;
          "
        >
          Learn. Build. Grow.
        </p>
      </div>

      <p
        style="
          font-size: 16px;
          color: #111827;
          margin-bottom: 10px;
        "
      >
        Hi <strong>${name}</strong>,
      </p>

      <p
        style="
          font-size: 15px;
          color: #374151;
          line-height: 1.7;
        "
      >
        Your account has been successfully created on our LMS platform.
      </p>

      <p
        style="
          font-size: 15px;
          color: #374151;
          line-height: 1.7;
        "
      >
        You can now access courses, track your learning progress,
        complete assignments, and improve your skills with expert-led content.
      </p>

      <div style="text-align: center; margin: 35px 0;">
        <a
          href="#"
          style="
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: bold;
          "
        >
          Start Learning
        </a>
      </div>

      <div
        style="
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
        "
      >
        <h3
          style="
            margin-top: 0;
            color: #111827;
            font-size: 16px;
          "
        >
          What you can do next:
        </h3>

        <ul
          style="
            padding-left: 18px;
            color: #4b5563;
            font-size: 14px;
            line-height: 1.8;
          "
        >
          <li>Browse premium courses</li>
          <li>Track your learning progress</li>
          <li>Access course resources</li>
          <li>Earn certificates</li>
          <li>Learn from expert instructors</li>
        </ul>
      </div>

      <hr
        style="
          margin: 35px 0 20px;
          border: none;
          border-top: 1px solid #e5e7eb;
        "
      />

      <p
        style="
          font-size: 13px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.6;
        "
      >
        © ${new Date().getFullYear()} LMS Platform.
        All rights reserved.
      </p>

    </div>
  </div>
`;

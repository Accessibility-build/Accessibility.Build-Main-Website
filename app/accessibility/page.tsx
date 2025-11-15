export const metadata = {
  title: "Accessibility Statement | Accessibility.build",
  description: "Our commitment to making our website accessible to all users, including those with disabilities.",
}

export default function AccessibilityPage() {
  return (
    <div className="container-wide py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Accessibility Statement</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Last updated: May 15, 2023</p>

          <h2>Our Commitment</h2>
          <p>
            At Accessibility.build, we are committed to ensuring digital accessibility for people with disabilities. We
            are continually improving the user experience for everyone, and applying the relevant accessibility
            standards.
          </p>

          <h2>Conformance Status</h2>
          <p>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve
            accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and
            Level AAA.
          </p>
          <p>
            Accessibility.build is fully committed to providing a website that conforms to WCAG 2.2 Level AA. We have
            taken the following measures to ensure compliance:
          </p>
          <ul>
            <li>Regular accessibility audits and testing</li>
            <li>Keyboard navigation support throughout the site</li>
            <li>Proper semantic HTML structure</li>
            <li>Sufficient color contrast ratios</li>
            <li>Text alternatives for non-text content</li>
            <li>Responsive design that works on various devices and screen sizes</li>
            <li>Clear and consistent navigation</li>
          </ul>

          <h2>Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of Accessibility.build. Please let us know if you encounter
            accessibility barriers:
          </p>
          <ul>
            <li>
              <strong>Email:</strong> accessibility@accessibility.build
            </li>
            <li>
              <strong>Phone:</strong> (123) 456-7890
            </li>
            <li>
              <strong>Postal Address:</strong> 123 Accessibility Street, Web City, 12345
            </li>
          </ul>
          <p>We try to respond to feedback within 2 business days.</p>

          <h2>Assessment Approach</h2>
          <p>Accessibility.build assesses the accessibility of our website in the following ways:</p>
          <ul>
            <li>Self-evaluation</li>
            <li>External evaluation by accessibility experts</li>
            <li>User testing with assistive technologies</li>
            <li>Automated testing tools</li>
          </ul>

          <h2>Technical Specifications</h2>
          <p>
            Accessibility of Accessibility.build relies on the following technologies to work with the particular
            combination of web browser and any assistive technologies or plugins installed on your computer:
          </p>
          <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>WAI-ARIA</li>
          </ul>
          <p>These technologies are relied upon for conformance with the accessibility standards used.</p>

          <h2>Limitations and Alternatives</h2>
          <p>
            Despite our best efforts to ensure accessibility of Accessibility.build, there may be some limitations.
            Below is a description of known limitations, and potential solutions. Please contact us if you observe an
            issue not listed below.
          </p>
          <p>Known limitations for Accessibility.build:</p>
          <ol>
            <li>
              <strong>Comments from users:</strong> User-generated content may not be fully accessible. We monitor user
              comments and attempt to correct issues as soon as they are detected.
            </li>
            <li>
              <strong>Third-party content:</strong> We cannot claim responsibility for the accessibility of external
              content or third-party applications that we may link to or embed.
            </li>
          </ol>

          <h2>Compatibility with Browsers and Assistive Technology</h2>
          <p>Accessibility.build is designed to be compatible with the following assistive technologies:</p>
          <ul>
            <li>Screen readers (including NVDA, JAWS, VoiceOver, and TalkBack)</li>
            <li>Speech recognition software</li>
            <li>Screen magnification software</li>
            <li>Alternative keyboard and mouse input devices</li>
          </ul>
          <p>
            Accessibility.build is compatible with recent versions of major browsers including Chrome, Firefox, Safari,
            and Edge.
          </p>
        </div>
      </div>
    </div>
  )
}

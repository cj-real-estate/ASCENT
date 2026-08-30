import type { Vertical } from "@content/verticals/types";

/*
 * The server/client boundary of the ICP gate.
 *
 * QualifyFlow is a client component, and every prop handed to it is
 * serialized into the page's flight payload — readable in view-source.
 * So the props are built HERE, on the server, with two things stripped:
 *
 *   - the `qualifies` flag on every option (otherwise the page source
 *     lists exactly which answers pass, and the gate is a quiz with the
 *     answer key printed on it);
 *   - the scheduling link (otherwise a declined visitor still holds the
 *     booking URL and can book anyway).
 *
 * The verdict and — only on a qualifying submit — the scheduling link come
 * back from /api/book, which recomputes both from the content module. The
 * server stays the single authority on who sees the calendar.
 */

export interface QualifyFlowQuestion {
  key: string;
  label: string;
  /** Option labels only — never the qualifies flags. */
  options: string[];
}

export interface QualifyFlowProps {
  slug: string;
  nameLabel: string;
  companyLabel: string;
  phoneLabel: string;
  emailLabel: string;
  questions: QualifyFlowQuestion[];
  stepLabel: string;
  backLabel: string;
  continueLabel: string;
  contactHeading: string;
  contactSub: string;
  submitLabel: string;
  submittingLabel: string;
  passHeading: string;
  passBody: string;
  passFallbackBody: string;
  declineHeading: string;
  declineBody: string;
}

export function toQualifyFlowProps(vertical: Vertical): QualifyFlowProps {
  const q = vertical.qualification;
  return {
    slug: vertical.slug,
    nameLabel: q.nameLabel,
    companyLabel: q.companyLabel,
    phoneLabel: q.phoneLabel,
    emailLabel: q.emailLabel,
    questions: q.questions.map((question) => ({
      key: question.key,
      label: question.label,
      options: question.options.map((option) => option.label),
    })),
    stepLabel: q.stepLabel,
    backLabel: q.backLabel,
    continueLabel: q.continueLabel,
    contactHeading: q.contactHeading,
    contactSub: q.contactSub,
    submitLabel: q.submitLabel,
    submittingLabel: q.submittingLabel,
    passHeading: q.passHeading,
    passBody: q.passBody,
    passFallbackBody: q.passFallbackBody,
    declineHeading: q.declineHeading,
    declineBody: q.declineBody,
  };
}

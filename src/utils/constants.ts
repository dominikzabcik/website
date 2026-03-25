// Prague timezone formatter
export const PragueTimeFormatter = new Intl.DateTimeFormat(undefined, {
    timeZone: 'Europe/Prague',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
});

export const RelativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
    style: 'long',
});

/** Date of birth — 17 November 2003 */
export const dob = new Date('2003-11-17T12:00:00');

/** Age in full years (updates correctly around birthdays). */
export function getAge(): number {
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        years--;
    }
    return years;
}

/** Whether this calendar year's birthday has already occurred. */
export const hasHadBirthdayThisYear = (() => {
    const now = new Date();
    const thisYearBirthday = new Date(
        now.getFullYear(),
        dob.getMonth(),
        dob.getDate(),
    );
    return now >= thisYearBirthday;
})();

export const nextBirthdayYear =
    new Date().getFullYear() + (hasHadBirthdayThisYear ? 1 : 0);

export const daysUntilBirthday = RelativeTimeFormatter.formatToParts(
    Math.floor(
        (new Date(nextBirthdayYear, dob.getMonth(), dob.getDate()).getTime() -
            Date.now()) /
            1000 /
            60 /
            60 /
            24,
    ),
    'day',
)[1]!.value.toString();

// Hardcoded location for Apple Maps
export const location = 'Prague, Czech Republic';

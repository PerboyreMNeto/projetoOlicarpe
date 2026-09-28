const teamGallery = document.querySelector('#team-gallery');
const previousTeamPhotos = document.querySelector('#team-previous');
const nextTeamPhotos = document.querySelector('#team-next');

if (teamGallery && previousTeamPhotos && nextTeamPhotos) {
    const getScrollStep = () => {
        const firstPhoto = teamGallery.querySelector('figure');
        const gap = Number.parseFloat(getComputedStyle(teamGallery).gap) || 0;
        const photoWidth = firstPhoto.getBoundingClientRect().width;
        const visiblePhotos = Math.max(1, Math.floor((teamGallery.clientWidth + gap) / (photoWidth + gap)));

        return visiblePhotos * (photoWidth + gap);
    };

    const updateControls = () => {
        const maxScroll = teamGallery.scrollWidth - teamGallery.clientWidth;
        previousTeamPhotos.disabled = teamGallery.scrollLeft <= 1;
        nextTeamPhotos.disabled = teamGallery.scrollLeft >= maxScroll - 1;
    };

    previousTeamPhotos.addEventListener('click', () => {
        teamGallery.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    nextTeamPhotos.addEventListener('click', () => {
        teamGallery.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    teamGallery.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateControls);
    });

    teamGallery.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            teamGallery.scrollBy({
                left: event.key === 'ArrowRight' ? getScrollStep() : -getScrollStep(),
                behavior: 'smooth'
            });
        }
    });

    window.addEventListener('resize', updateControls);
    updateControls();
}
